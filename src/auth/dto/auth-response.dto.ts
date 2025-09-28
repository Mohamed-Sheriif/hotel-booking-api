import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'user@example.com' },
      user_type: { type: 'string', example: 'Customer' },
      first_name: { type: 'string', example: 'Ahmed' },
    },
  })
  user: {
    id: number;
    email: string;
    user_type: string;
    first_name: string;
  };
}
