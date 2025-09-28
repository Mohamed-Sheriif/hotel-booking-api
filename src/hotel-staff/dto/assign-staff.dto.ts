import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignStaffDto {
  @ApiProperty({
    description: 'Hotel ID where staff will be assigned',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  hotelId: number;

  @ApiProperty({
    description: 'User ID of the staff member',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiPropertyOptional({
    description: 'Staff position/title',
    example: 'Receptionist',
  })
  @IsString()
  @IsOptional()
  position?: string;
}
