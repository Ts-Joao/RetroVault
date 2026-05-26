import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";

export const TokenPayloadParam = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[REQUEST_TOKEN_PAYLOAD_NAME]
  }
)