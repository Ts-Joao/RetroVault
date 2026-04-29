import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import * as bcrypt from "bcrypt";

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const token = request.headers.authorization?.split(' ')[1]

        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })
            const user = await this.usersService.getById(payload.sub)

            if (!user?.refreshToken) {
                throw new UnauthorizedException('Invalid refresh token')
            }

            const valid = await bcrypt.compare(token, user.refreshToken)

            if (!valid) {
                throw new UnauthorizedException('Invalid refresh token')
            }

            (request as any).user = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };

            return true
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
}