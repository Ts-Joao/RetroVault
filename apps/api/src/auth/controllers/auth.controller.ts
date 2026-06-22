import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import LoginDto from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorator/current-user.decorator';
import type { Response, Request } from 'express';
import { PayloadDto } from '../dto/payload.dto';
import { AuthTokenGuard } from '../guard/auth-token.guard';
import { RefreshGuard } from '../guard/refresh.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.authenticate(loginDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh',
    });

    return { message: 'Logged in successfully!', accessToken };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('me')
  @UseGuards(AuthTokenGuard)
  me(@CurrentUser() user: PayloadDto) {
    return user.sub;
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('refresh')
  @UseGuards(RefreshGuard)
  async refresh(
    @CurrentUser() user: PayloadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
<<<<<<< HEAD:apps/api/src/auth/auth.controller.ts
    const tokens = await this.authService.generateToken(user.sub, user.email, user.role, user.name, user.slug);
=======
    const tokens = await this.authService.generateToken(
      user.sub,
      user.email,
      user.role,
      user.name,
      user.slug,
    );
>>>>>>> develop:apps/api/src/auth/controllers/auth.controller.ts
    await this.authService.saveRefreshToken(user.sub, tokens.refreshToken);

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
<<<<<<< HEAD:apps/api/src/auth/auth.controller.ts
      path: '/api/auth/refresh'
=======
      path: '/api/auth/refresh',
>>>>>>> develop:apps/api/src/auth/controllers/auth.controller.ts
    });

    return { accessToken: tokens.accessToken };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('logout')
  @UseGuards(AuthTokenGuard)
  async logout(
    @CurrentUser() user: PayloadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);
    console.log(user.sub);
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });

    return { message: 'Logged out successfully!' };
  }
}
