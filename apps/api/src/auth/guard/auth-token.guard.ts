import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request, Response } from "express";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest<Request>()
    const token = this.extractTokenHeader(request)
    
    if (!token) {
      throw new UnauthorizedException('Authorization token not found')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_ACCESS_SECRET })
      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('Invalid or expired authorization token')
    }

    return true
  }

  private extractTokenHeader(request: Request) {
    const authorization = request.headers?.authorization

    if (!authorization || typeof authorization !== 'string') {
      return
    }

    return authorization.split(' ')[1]
  }
}
  