import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { HotelResponseDto } from 'src/hotels/dto/hotel-response.dto';
import { ReservationResponseDto } from 'src/reservations/dto/reservation-response.dto';

export class ReviewResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the review',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID of the user who wrote the review',
    example: 1,
  })
  user_id: number;

  @ApiProperty({
    description: 'ID of the hotel being reviewed',
    example: 1,
  })
  hotel_id: number;

  @ApiProperty({
    description: 'ID of the reservation associated with the review',
    example: 1,
  })
  reservation_id: number;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiPropertyOptional({
    description: 'Review title',
    example: 'Excellent stay!',
    nullable: true,
  })
  title?: string | null;

  @ApiPropertyOptional({
    description: 'Review comment',
    example: 'The hotel was amazing with great service and clean rooms.',
    nullable: true,
  })
  comment?: string | null;

  @ApiProperty({
    description: 'Date when the review was created',
    example: '2024-01-15T10:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Date when the review was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'User details who wrote the review',
    type: UserResponseDto,
  })
  user?: UserResponseDto;

  @ApiPropertyOptional({
    description: 'Hotel details being reviewed',
    type: HotelResponseDto,
  })
  hotel?: HotelResponseDto;

  @ApiPropertyOptional({
    description: 'Reservation details associated with the review',
    type: ReservationResponseDto,
  })
  reservation?: ReservationResponseDto;
}
