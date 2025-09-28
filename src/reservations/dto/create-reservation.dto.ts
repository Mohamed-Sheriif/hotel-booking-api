import { IsDateString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Room ID for the reservation',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  room_id: number;

  @ApiProperty({
    description: 'Check-in date (YYYY-MM-DD format)',
    example: '2024-02-15',
    format: 'date',
  })
  @IsDateString()
  check_in_date: string;

  @ApiProperty({
    description: 'Check-out date (YYYY-MM-DD format)',
    example: '2024-02-18',
    format: 'date',
  })
  @IsDateString()
  check_out_date: string;

  @ApiProperty({
    description: 'Number of guests for the reservation',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  number_of_guests: number;
}
