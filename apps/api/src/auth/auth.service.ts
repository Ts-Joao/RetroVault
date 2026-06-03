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
  constructor(
    private readonly hashingService: HashingServiceProtocol,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly databaseService: DatabaseService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async authenticate(loginDto: LoginDto) {
    try {
      const user = await this.databaseService.user.findFirst({
        where: {
          email: loginDto.email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await this.hashingService.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await this.generateTokens(user.id);

      return { ...tokens };
    } catch (error) {
      if (error instanceof HttpException) {
        console.error(error)
        throw error;
      }

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
            expiresIn: 90000,
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

  async validateTokenUser(tokenPayload: PayloadDto, userId: string) {
    try {
      if (tokenPayload.sub !== userId || tokenPayload.role === 'ADMIN') {
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
