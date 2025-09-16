import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginDto } from './dto/login.dto';
import { AllowAnonymous } from './decorator/allow-anonymous.decorator';
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { ActiveUser } from './decorator/active-user.decorator';
import { RegisterStaffDto } from './dto/register-staff.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @AllowAnonymous()
  @Post('register/customer')
  async registerCustomer(@Body() registerCustomerDto: RegisterCustomerDto) {
    return this.authService.registerCustomer(registerCustomerDto);
  }

  @Post('register/staff')
  async registerStaff(
    @Body() registerStaffDto: RegisterStaffDto,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.authService.registerStaff(registerStaffDto, user);
  }
}
