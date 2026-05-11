import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import LoginDto from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import type { JwtPayload } from './type/jwt-payload.type';
import { RefreshGuard } from './jwt/refresh.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.login(loginDto.email, loginDto.password)
        return user
    }

    @Post('refresh')
    @UseGuards(RefreshGuard)
    async refresh(@CurrentUser() user: JwtPayload) {
        return this.authService.generateToken(user.sub, user.email, user.role)
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    async logout(@CurrentUser() user: JwtPayload) {
        return this.authService.logout(user.sub)
    }
}
