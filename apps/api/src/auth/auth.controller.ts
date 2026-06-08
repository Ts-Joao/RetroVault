import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import LoginDto from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import type { Response, Request } from 'express';
import { PayloadDto } from './dto/payload.dto';
import { AuthTokenGuard } from './guard/auth-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.authenticate(loginDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh'
    });

    return { message: 'Logged in successfully!', accessToken };
  }

  @Get('me')
  @UseGuards(AuthTokenGuard)
  me(@CurrentUser() user: PayloadDto) {
    return user.sub;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(req.cookies?.refresh_token);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh'
    });

    return { message: 'Token refreshed successfully!', accessToken };
  }

  @Post('logout')
  @UseGuards(AuthTokenGuard)
  async logout(
    @CurrentUser() user: PayloadDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.sub);
    console.log(user.sub)
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });

    return { message: 'Logged out successfully!' };
  }
}
