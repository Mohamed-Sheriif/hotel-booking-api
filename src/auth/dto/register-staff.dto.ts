import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterStaffDto {
  @ApiProperty({
    description: 'Staff member first name',
    example: 'Sarah',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Staff member last name',
    example: 'Ahmed',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Staff member email address',
    example: 'sarah.ahmed@hotel.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Staff member password (must contain at least one uppercase letter and one number)',
    example: 'StaffPass123',
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
    description: 'Staff member phone number (Egyptian format)',
    example: '01234567890',
    pattern: '^(010|012|015)[0-9]{8}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(010|012|015)[0-9]{8}$/, {
    message:
      'Phone number must be a valid Egyptian number (starts with 010, 012, or 015 and is 11 digits long)',
  })
  phone_number?: string;

  @ApiProperty({
    description: 'Hotel ID where the staff member will work',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  hotel_id: number;

  @ApiPropertyOptional({
    description: 'Staff member position/title',
    example: 'Receptionist',
  })
  @IsString()
  @IsOptional()
  position?: string;
}
