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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomResponseDto } from './dto/room-response.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { AllowAnonymous } from 'src/auth/decorator/allow-anonymous.decorator';

@ApiTags('Rooms')
@Controller('api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new room',
    description:
      "Creates a new room for the authenticated user's hotel. Requires staff authentication.",
  })
  @ApiBody({
    type: CreateRoomDto,
    description: 'Room creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Invalid input data or room number already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff access required',
  })
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<RoomResponseDto> {
    // Ignore incoming hotel_id and enforce active user's hotel
    const result = await this.roomsService.create(
      { ...createRoomDto, hotel_id: user.hotel_id },
      user,
    );
    return result as RoomResponseDto;
  }

  @AllowAnonymous()
  @Get(':hotelId')
  @ApiOperation({
    summary: 'Get all rooms for a hotel',
    description:
      'Retrieves all rooms for a specific hotel. This endpoint is publicly accessible.',
  })
  @ApiParam({
    name: 'hotelId',
    description: 'Hotel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of rooms retrieved successfully',
    type: [RoomResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel not found',
  })
  async findAllForHotel(
    @Param('hotelId', ParseIntPipe) hotelId: number,
  ): Promise<RoomResponseDto[]> {
    const result = await this.roomsService.findAllForHotel(hotelId);
    return result as RoomResponseDto[];
  }

  @AllowAnonymous()
  @Get(':id/reservations')
  @ApiOperation({
    summary: 'Get room with reservations',
    description:
      'Retrieves room details along with its reservations. This endpoint is publicly accessible.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room with reservations retrieved successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RoomResponseDto> {
    const result = await this.roomsService.findOne(id);
    return result as RoomResponseDto;
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update room',
    description:
      "Updates room information. Requires staff authentication for the room's hotel.",
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateRoomDto,
    description: 'Room update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    type: RoomResponseDto,
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
    description: 'Forbidden - Staff access required for this hotel',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<RoomResponseDto> {
    const result = await this.roomsService.update(id, dto, user);
    return result as RoomResponseDto;
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete room',
    description:
      "Deletes a room. Requires staff authentication for the room's hotel.",
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff access required for this hotel',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.roomsService.remove(id, user);
  }
}
