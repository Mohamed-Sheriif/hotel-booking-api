import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HotelResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the hotel',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the hotel',
    example: 'Grand Palace Hotel',
  })
  name: string;

  @ApiProperty({
    description: 'The complete address of the hotel',
    example: '123 Main Street, Downtown District',
  })
  address: string;

  @ApiProperty({
    description: 'The city where the hotel is located',
    example: 'Cairo',
  })
  city: string;

  @ApiProperty({
    description: 'The country where the hotel is located',
    example: 'Egypt',
  })
  country: string;

  @ApiProperty({
    description: 'The contact phone number of the hotel',
    example: '+20 123 456 7890',
  })
  phone_number: string;

  @ApiPropertyOptional({
    description: 'Optional description of the hotel',
    example:
      'A luxurious hotel with world-class amenities and exceptional service',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Average rating of the hotel (0.00 to 5.00)',
    example: '4.5',
  })
  average_rating: string;

  @ApiProperty({
    description: 'Total number of reviews for the hotel',
    example: 150,
  })
  review_count: number;

  @ApiProperty({
    description: 'Date when the hotel was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the hotel was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
