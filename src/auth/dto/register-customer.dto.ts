import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterCustomerDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @MaxLength(20, { message: 'Password must be at most 20 characters.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter and one number.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^(010|012|015)[0-9]{8}$/, {
    message:
      'Phone number must be a valid Egyptian number (starts with 010, 012, or 015 and is 11 digits long)',
  })
  phone_number?: string;
}
