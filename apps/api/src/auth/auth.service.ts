import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import LoginDto from './dto/login.dto';
import { PayloadDto } from './dto/payload.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  /**
   * Called by AuthController.login — authenticates credentials and returns tokens.
   */
  async authenticate(loginDto: LoginDto) {
    const user = await this.usersService.getByEmail(loginDto.email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatch = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.generateToken(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async generateToken(sub: string, email: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub, email, role },
        { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET! },
      ),
      this.jwtService.signAsync(
        { sub, email, role },
        { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET! },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    return this.usersService.updateRefreshToken(userId, refreshToken);
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
        throw new ForbiddenException(
          'You are not authorized to perform this operation!',
        );
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
