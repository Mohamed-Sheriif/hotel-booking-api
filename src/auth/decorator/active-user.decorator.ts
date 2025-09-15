/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserType } from '../interfaces/active-user-type.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return field ? user[field] : user;
  },
);
