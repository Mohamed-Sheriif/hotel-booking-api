import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HotelStaffService } from './hotel-staff.service';
import { HotelStaffResponseDto } from './dto/hotel-staff-response.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { AllowAnonymous } from 'src/auth/decorator/allow-anonymous.decorator';

@ApiTags('Hotel Staff')
@Controller('api/hotel-staff')
export class HotelStaffController {
  constructor(private readonly hotelStaffService: HotelStaffService) {}

  @Delete(':staffId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Remove staff from hotel',
    description:
      'Removes a staff member from hotel assignment. Requires admin authentication.',
  })
  @ApiParam({
    name: 'staffId',
    description: 'Staff member ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Staff member removed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Staff member not found',
  })
  async remove(
    @Param('staffId', ParseIntPipe) staffId: number,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.hotelStaffService.removeStaffFromHotel(staffId, activeUser);
  }

  @AllowAnonymous()
  @Get('hotel/:hotelId')
  @ApiOperation({
    summary: 'Get hotel staff list',
    description:
      'Retrieves all staff members for a specific hotel. This endpoint is publicly accessible.',
  })
  @ApiParam({
    name: 'hotelId',
    description: 'Hotel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel staff list retrieved successfully',
    type: [HotelStaffResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel not found',
  })
  async list(
    @Param('hotelId', ParseIntPipe) hotelId: number,
  ): Promise<HotelStaffResponseDto[]> {
    const result = await this.hotelStaffService.listHotelStaff(hotelId);
    return result as HotelStaffResponseDto[];
  }
}
