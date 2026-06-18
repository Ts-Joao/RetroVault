import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: PayloadDto = request.user;
    const id = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.sub === id || user.role === 'ADMIN') return true;

    throw new ForbiddenException();
  }
}
