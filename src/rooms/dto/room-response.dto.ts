import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoomResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the room',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Hotel ID where the room is located',
    example: 1,
  })
  hotel_id: number;

  @ApiProperty({
    description: 'Room type ID',
    example: 1,
  })
  room_type_id: number;

  @ApiProperty({
    description: 'Room number (unique within hotel)',
    example: '101',
  })
  room_number: string;

  @ApiPropertyOptional({
    description: 'Floor number where the room is located',
    example: 1,
  })
  floor?: number | null;

  @ApiProperty({
    description: 'Room availability status',
    example: true,
  })
  is_available: boolean;

  @ApiProperty({
    description: 'Date when the room was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the room was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Room type details',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Deluxe Suite' },
      description: { type: 'string', example: 'Spacious room with city view' },
      base_price: { type: 'string', example: '150.00' },
      capacity: { type: 'number', example: 2 },
    },
  })
  room_type?: {
    id: number;
    name: string;
    description: string | null;
    base_price: string;
    capacity: number;
  };
}
