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
import { RoomTypesService } from './room-types.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { RoomTypeResponseDto } from './dto/room-type-response.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@ApiTags('Room Types')
@Controller('api/room-types')
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new room type',
    description: 'Creates a new room type. Requires staff authentication.',
  })
  @ApiBody({
    type: CreateRoomTypeDto,
    description: 'Room type creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Room type created successfully',
    type: RoomTypeResponseDto,
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
    description: 'Forbidden - Staff access required',
  })
  async create(
    @Body() dto: CreateRoomTypeDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<RoomTypeResponseDto> {
    const result = await this.roomTypesService.create(dto, user);
    return result as RoomTypeResponseDto;
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all room types',
    description: 'Retrieves all room types. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of room types retrieved successfully',
    type: [RoomTypeResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async findAll(
    @ActiveUser() user: ActiveUserType,
  ): Promise<RoomTypeResponseDto[]> {
    const result = await this.roomTypesService.findAll(user);
    return result as RoomTypeResponseDto[];
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get room type by ID',
    description: 'Retrieves detailed information about a specific room type.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room type ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room type information retrieved successfully',
    type: RoomTypeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Room type not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ): Promise<RoomTypeResponseDto> {
    const result = await this.roomTypesService.findOne(id, user);
    return result as RoomTypeResponseDto;
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update room type',
    description:
      'Updates room type information. Requires staff authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room type ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateRoomTypeDto,
    description: 'Room type update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Room type updated successfully',
    type: RoomTypeResponseDto,
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
    description: 'Forbidden - Staff access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Room type not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomTypeDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<RoomTypeResponseDto> {
    const result = await this.roomTypesService.update(id, dto, user);
    return result as RoomTypeResponseDto;
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete room type',
    description: 'Deletes a room type. Requires staff authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room type ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room type deleted successfully',
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
    description: 'Room type not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ) {
    return this.roomTypesService.remove(id, user);
  }
}
