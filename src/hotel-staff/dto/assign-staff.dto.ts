import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AssignStaffDto {
  @IsInt()
  @Min(1)
  hotelId: number;

  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  @IsOptional()
  position?: string;
}
