import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor (
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    async login(email: string, plainPassword: string) {
        const user = await this.usersService.getByEmail(email)

        if (!user) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)

        const passwordMatch = await bcrypt.compare(plainPassword, user.password)

        if (!passwordMatch) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)

        const tokens = await this.generateTokens(user.id, user.email, user.role, user.name)
        await this.saveRefreshToken(user.id, tokens.refresh_token)
        return tokens
    }
    
    async generateAccessToken(sub: string, email: string, role: Role, name: string) {
        return this.jwtService.signAsync({ sub, email, role, name }, { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET! })
    }

    async generateTokens(sub: string, email: string, role: Role, name: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.generateAccessToken(sub, email, role, name),
            this.jwtService.signAsync({ sub, email, role }, { expiresIn: '7d', secret: process.env.REFRESH_SECRET! })
        ])

        return { access_token, refresh_token }
    }
    
    async saveRefreshToken(userId: string, refresh_token: string) {
        const hash = await bcrypt.hash(refresh_token, 12)
        return this.usersService.updateRefreshToken(userId, hash)
    }

    async logout(userId: string) {
        return this.usersService.updateRefreshToken(userId, null)
    }
}
