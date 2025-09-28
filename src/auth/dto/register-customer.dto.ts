import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCustomerDto {
  @ApiProperty({
    description: 'Customer first name',
    example: 'Ahmed',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Mohamed',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'ahmed.mohamed@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Customer password (must contain at least one uppercase letter and one number)',
    example: 'Password123',
    minLength: 6,
    maxLength: 20,
    pattern: '^(?=.*[A-Z])(?=.*\\d).+$',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @MaxLength(20, { message: 'Password must be at most 20 characters.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter and one number.',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Customer phone number (Egyptian format)',
    example: '01012345678',
    pattern: '^(010|012|015)[0-9]{8}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(010|012|015)[0-9]{8}$/, {
    message:
      'Phone number must be a valid Egyptian number (starts with 010, 012, or 015 and is 11 digits long)',
  })
  phone_number?: string;
}
