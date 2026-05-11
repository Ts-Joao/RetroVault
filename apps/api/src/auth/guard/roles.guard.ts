import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../type/jwt-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<String[]>('roles', context.getHandler())

    if (!roles) {
      return true
    }

    const user: JwtPayload = context.switchToHttp().getRequest().user

    if (!roles.includes(user.role)) throw new ForbiddenException()
    
    return true;
  }
}
