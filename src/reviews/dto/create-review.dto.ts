import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Hotel ID for the review',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  hotel_id: number;

  @ApiProperty({
    description: 'Reservation ID for the review',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  reservation_id: number;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating must be at most 5 stars' })
  rating: number;

  @ApiPropertyOptional({
    description: 'Review title',
    example: 'Excellent stay!',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Review comment',
    example: 'The hotel was amazing with great service and clean rooms.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
