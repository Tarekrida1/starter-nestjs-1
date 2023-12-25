import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthenticatedUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);
