import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from '../provider/hashing.provider';
import authConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await this.hashingProvider.comparePassword(
      loginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      user_type: user.user_type,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.authConfiguration.secret,
      expiresIn: this.authConfiguration.expiresIn,
      audience: this.authConfiguration.audience,
      issuer: this.authConfiguration.issuer,
    });

    // Return token and user info
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        first_name: user.first_name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    return this.userService.createUser(registerDto);
  }
}
