import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  room_id: number;

  @IsDateString()
  check_in_date: string;

  @IsDateString()
  check_out_date: string;

  @IsInt()
  @Min(1)
  number_of_guests: number;
}
