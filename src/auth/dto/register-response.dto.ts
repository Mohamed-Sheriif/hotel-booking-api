import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: 'Success',
  })
  status: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'user@example.com' },
      first_name: { type: 'string', example: 'Ahmed' },
      last_name: { type: 'string', example: 'Mohamed' },
      user_type: { type: 'string', example: 'Customer' },
      phone_number: { type: 'string', example: '01012345678' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  })
  result: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    phone_number?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
