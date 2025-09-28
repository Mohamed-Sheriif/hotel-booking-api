import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiPropertyOptional({
    description: 'Hotel ID (automatically set from authenticated user)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  hotel_id?: number;

  @ApiProperty({
    description: 'Room type ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  room_type_id: number;

  @ApiProperty({
    description: 'Room number (unique within hotel)',
    example: '101',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  room_number: string;

  @ApiPropertyOptional({
    description: 'Floor number where the room is located',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  floor?: number;

  @ApiPropertyOptional({
    description: 'Room availability status',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}
