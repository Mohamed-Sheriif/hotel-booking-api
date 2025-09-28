import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'ahmed.mohamed@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Ahmed',
  })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Mohamed',
  })
  last_name: string;

  @ApiProperty({
    description: 'User type',
    enum: UserType,
    example: UserType.Customer,
  })
  user_type: UserType;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '01012345678',
  })
  phone_number?: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
