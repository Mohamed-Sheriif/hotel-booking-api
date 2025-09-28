import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HotelStaffResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the hotel staff assignment',
    example: 1,
  })
  id: number;

  @ApiPropertyOptional({
    description: 'Staff position/title',
    example: 'Receptionist',
    nullable: true,
  })
  position?: string | null;

  @ApiProperty({
    description: 'Staff active status',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Date when staff was assigned',
    example: '2024-01-15T10:30:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Staff user information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'staff@hotel.com' },
      first_name: { type: 'string', example: 'Sarah' },
      last_name: { type: 'string', example: 'Ahmed' },
      user_type: { type: 'string', example: 'Staff' },
      phone_number: { type: 'string', example: '01234567890' },
    },
  })
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    phone_number?: string;
  };

  @ApiProperty({
    description: 'Hotel information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Grand Palace Hotel' },
      city: { type: 'string', example: 'Cairo' },
      country: { type: 'string', example: 'Egypt' },
    },
  })
  hotel: {
    id: number;
    name: string;
    city: string;
    country: string;
  };
}
