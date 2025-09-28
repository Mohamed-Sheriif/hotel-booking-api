import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoomTypeResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the room type',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Room type name',
    example: 'Deluxe Suite',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Room type description',
    example: 'Spacious room with city view and modern amenities',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Base price per night',
    example: '150.00',
  })
  base_price: string;

  @ApiProperty({
    description: 'Maximum occupancy capacity',
    example: 2,
  })
  capacity: number;

  @ApiPropertyOptional({
    description: 'Available amenities',
    example: 'WiFi, Air Conditioning, Mini Bar, Room Service',
    nullable: true,
  })
  amenities?: string | null;

  @ApiProperty({
    description: 'Date when the room type was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the room type was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
