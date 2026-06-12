import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hashing.service';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import type { StringValue } from 'ms';
import LoginDto from './dto/login.dto';
import { PayloadDto } from './dto/payload.dto';
import { DatabaseService } from 'src/database/database.service';

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

        const tokens = await this.generateToken(user.id, user.email, user.role)
        await this.saveRefreshToken(user.id, tokens.refresh_token)
        return tokens
    }

    async generateToken(sub: string, email: string, role: Role) {
        const [acess_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({ sub, email, role}, { expiresIn: '15min', secret: process.env.JWT_ACCESS_SECRET! }),
            this.jwtService.signAsync({ sub, email, role }, { expiresIn: '7d', secret: process.env.REFRESH_SECRET! })
        ])
        return { acess_token, refresh_token }
    }

    async saveRefreshToken(userId: string, refresh_token: string) {
        const hash = await bcrypt.hash(refresh_token, 12)
        return this.usersService.updateRefreshToken(userId, hash)
    }

  async logout(userId: string) {
    try {
      return this.usersService.updateRefreshToken(userId, null);

    } catch (error) {
      throw new InternalServerErrorException('Failed to logout');
    }
  }

  async validateTokenUser(tokenPayload: PayloadDto, userId: string) {
    try {
      if (tokenPayload.sub !== userId && tokenPayload.role !== 'ADMIN') {
        throw new ForbiddenException(
          'You are not authorized to perform this operation!',
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to validate token user');
    }
  }

  async validateAdminToken(tokenPayload: PayloadDto) {
    try {
      if (tokenPayload.role !== 'ADMIN') {
        throw new ForbiddenException('You are not authorized to perform this operation!');
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to validate admin');
    }
  }

  async verifyIsSeller(sellerId: string) {
    try {
      const seller = await this.usersService.getById(sellerId);

      if (seller.role !== 'SELLER') {
        throw new UnauthorizedException('User is not a seller');
      }

      return seller;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error checking if user is a seller!',
      );
    }
  }
}
