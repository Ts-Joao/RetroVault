import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import LoginDto from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import type { JwtPayload } from './type/jwt-payload.type';
import { RefreshGuard } from './jwt/refresh.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { access_token, refresh_token } = await this.authService.login(loginDto.email, loginDto.password)

        res.cookie('access_token', access_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ message: 'Logged in successfully!' })
    }

    @Post('login-mobile')
    async loginMobile(@Body() body: { email: string, password: string }) {
        return this.authService.login(body.email, body.password)
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    me(@CurrentUser() user: JwtPayload) {
        return user
    }

    @Post('refresh')
    @UseGuards(RefreshGuard)
    async refresh(@CurrentUser() user: JwtPayload, @Res() res: Response) {
        const access_token = await this.authService.generateAccessToken(user.sub, user.email, user.role, user.name)

        res.cookie('access_token', access_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        })

        return res.json({ message: 'Token refreshed successfully!' })
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    async logout(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(user.sub)
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        
        return res.json({ message: 'Logged out successfully!' })
    }
}
