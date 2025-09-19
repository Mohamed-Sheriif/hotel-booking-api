/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../config/auth.config';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/constants/constants';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read isPublic metadata
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    //1. EXTRACT REQUEST FROM EXECTTION CONTEXT
    const request = context.switchToHttp().getRequest();

    //2. EXTRACT TOKEN FROM REQUEST HEADER
    const token = request.headers.authorization?.split(' ')[1];

    //2. VALIDATE TOKEN AND PROVIDE / DENY ACCESS
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.authConfiguration,
      );

      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token!');
    }

    return true;
  }
}
