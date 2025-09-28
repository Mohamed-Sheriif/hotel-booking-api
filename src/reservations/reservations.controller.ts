import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@ApiTags('Reservations')
@Controller('api/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new reservation',
    description:
      'Creates a new reservation for a room. Customers can create reservations for themselves.',
  })
  @ApiBody({
    type: CreateReservationDto,
    description: 'Reservation creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or room not available',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async create(
    @Body() dto: CreateReservationDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReservationResponseDto> {
    const result = await this.reservationsService.create(dto, user);
    return result as ReservationResponseDto;
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all reservations',
    description:
      'Retrieves all reservations. Customers see their own reservations, staff see hotel reservations.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reservations retrieved successfully',
    type: [ReservationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async findAll(
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReservationResponseDto[]> {
    const result = await this.reservationsService.findAll(user);
    return result as ReservationResponseDto[];
  }

  @Get('room/:roomId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get reservations for a room',
    description:
      'Retrieves all reservations for a specific room. Requires staff authentication.',
  })
  @ApiParam({
    name: 'roomId',
    description: 'Room ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room reservations retrieved successfully',
    type: [ReservationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async findRoomReservations(
    @Param('roomId', ParseIntPipe) roomId: number,
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReservationResponseDto[]> {
    const result = await this.reservationsService.findRoomReservations(
      roomId,
      user,
    );
    return result as ReservationResponseDto[];
  }

  @Get('customer/:customerId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get customer reservations',
    description:
      'Retrieves all reservations for a specific customer. Requires staff authentication.',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer reservations retrieved successfully',
    type: [ReservationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  async getCustomerReservations(
    @Param('customerId', ParseIntPipe) customerId: number,
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReservationResponseDto[]> {
    const result = await this.reservationsService.getCustomerReservations(
      customerId,
      user,
    );
    return result as ReservationResponseDto[];
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get reservation by ID',
    description: 'Retrieves detailed information about a specific reservation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation information retrieved successfully',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReservationResponseDto> {
    const result = await this.reservationsService.findOne(id, user);
    return result as ReservationResponseDto;
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update reservation',
    description:
      'Updates reservation information. Customers can update their own reservations.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateReservationDto,
    description: 'Reservation update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only update own reservations',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReservationResponseDto> {
    const result = await this.reservationsService.update(id, dto, user);
    return result as ReservationResponseDto;
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cancel reservation',
    description:
      'Cancels a reservation. Customers can cancel their own reservations.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only cancel own reservations',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.reservationsService.remove(id, user);
  }
}
