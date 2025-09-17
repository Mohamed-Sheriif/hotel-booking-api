import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRoomDto {
  @IsOptional()
  @IsInt()
  hotel_id?: number;

  @IsInt()
  room_type_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  room_number: string;

  @IsOptional()
  @IsInt()
  floor?: number;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}
