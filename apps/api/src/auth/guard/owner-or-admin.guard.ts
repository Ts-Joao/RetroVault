import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtPayload } from "../type/jwt-payload.type";

@Injectable()
export class SelfOrAdminGuard  implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const user: JwtPayload = request.user
        const id = request.params.id

        if (!user) {
            throw new ForbiddenException('User not authenticated')
        }

        if (user.role === 'ADMIN' || user.sub === id ) return true

        throw new ForbiddenException()
    }
}