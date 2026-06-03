import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.constants';

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();

      console.log('CONTEÚDO DO PAYLOAD:', request[REQUEST_TOKEN_PAYLOAD_NAME]); // 👈 Adicione isso temporariamente
      return request[REQUEST_TOKEN_PAYLOAD_NAME];
    }
)