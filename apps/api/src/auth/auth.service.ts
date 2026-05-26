import {
  HttpException,
  HttpStatus,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingServiceProtocol,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async authenticate(loginDto: LoginDto) {
    try {
      const user = await this.usersService.getByEmail(loginDto.email);

      const passwordMatch = await this.hashingService.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordMatch)
        throw new UnauthorizedException('Invalid credentials');

      const tokens = await this.generateTokens(user.id);

      return { ...tokens };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException('Error authenticating user!');
    }
  }

  async generateTokens(sub: string) {
    try {
      const tokenTtl = this.jwtConfiguration.ttl;
      const expiresIn = tokenTtl
        ? /^\d+$/.test(tokenTtl)
          ? Number(tokenTtl)
          : (tokenTtl as StringValue)
        : undefined;

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { sub },
          {
            expiresIn: 900,
            secret: this.jwtConfiguration.secret,
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
          },
        ),
        this.jwtService.signAsync(
          { sub },
          {
            expiresIn,
            secret: this.jwtConfiguration.refreshSecret,
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
          },
        ),
      ]);

      await this.usersService.updateRefreshToken(sub, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error generating tokens!');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: string }>(refreshToken, {
        secret: this.jwtConfiguration.refreshSecret
      });

      const user = await this.usersService.getById(sub);

      const refreshTokenMatch = await this.hashingService.compare(
        refreshToken,
        user.refreshToken as string,
      );

      if (!refreshTokenMatch)
        throw new UnauthorizedException('Invalid refresh token');

      const tokens = await this.generateTokens(sub);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  async logout(userId: string) {
    try {
      return this.usersService.updateRefreshToken(userId, null);
    } catch (error) {
      throw new InternalServerErrorException('Failed to logout');
    }
  }
}
