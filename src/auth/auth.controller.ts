import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterStaffDto } from './dto/register-staff.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { AllowAnonymous } from './decorator/allow-anonymous.decorator';
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { ActiveUser } from './decorator/active-user.decorator';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return JWT access token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @AllowAnonymous()
  @Post('register/customer')
  @ApiOperation({
    summary: 'Register new customer',
    description:
      'Register a new customer account. This endpoint is publicly accessible.',
  })
  @ApiBody({
    type: RegisterCustomerDto,
    description: 'Customer registration data',
  })
  @ApiResponse({
    status: 201,
    description: 'Customer registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or email already exists',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already registered',
  })
  async registerCustomer(
    @Body() registerCustomerDto: RegisterCustomerDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.registerCustomer(registerCustomerDto);
  }

  @Post('register/staff')
  @ApiOperation({
    summary: 'Register new staff member',
    description:
      'Register a new staff member for a hotel. Requires authentication and appropriate permissions.',
  })
  @ApiBody({
    type: RegisterStaffDto,
    description: 'Staff registration data',
  })
  @ApiResponse({
    status: 201,
    description: 'Staff member registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or email already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already registered',
  })
  async registerStaff(
    @Body() registerStaffDto: RegisterStaffDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<RegisterResponseDto> {
    return this.authService.registerStaff(registerStaffDto, user);
  }
}
