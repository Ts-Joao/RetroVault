import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.constants';
import { UsersService } from 'src/users/users.service';
import { HashingServiceProtocol } from '../hash/hashing.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest<Request>();
    const token = request.cookies?.['refresh_token'];

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.getById(payload.sub);
      if (!user.refreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const isMatch = await this.hashingService.compare(token, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return true;
  }
}
