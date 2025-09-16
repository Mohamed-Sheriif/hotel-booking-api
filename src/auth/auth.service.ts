import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from '../provider/hashing.provider';
import authConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { UserType } from 'src/users/entities/user.entity';
import { RegisterStaffDto } from './dto/register-staff.dto';
import { HotelStaffService } from 'src/hotel-staff/hotel-staff.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    private readonly hotelStaffService: HotelStaffService,
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

    // Get hotel that this user is assigned if its a staff user
    const hotelStaff = await this.hotelStaffService.getHotelStaffByUserId(
      user.id,
    );

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      user_type: user.user_type,
      hotel_id: hotelStaff?.hotel.id ?? 0,
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

  async registerCustomer(registerCustomerDto: RegisterCustomerDto) {
    return this.userService.createCustomerUser(registerCustomerDto);
  }

  async registerStaff(
    registerStaffDto: RegisterStaffDto,
    user: ActiveUserType,
  ) {
    if (user.user_type !== UserType.Admin) {
      throw new UnauthorizedException('Only admin can create staff!');
    }

    return await this.userService.createStaffUser(registerStaffDto);
  }
}
