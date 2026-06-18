import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.constants';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return true;
  }
}
