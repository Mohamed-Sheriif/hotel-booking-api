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
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { AllowAnonymous } from 'src/auth/decorator/allow-anonymous.decorator';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';

@ApiTags('Hotels')
@Controller('api/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new hotel',
    description:
      'Creates a new hotel. Requires authentication and appropriate permissions.',
  })
  @ApiBody({
    type: CreateHotelDto,
    description: 'Hotel creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Hotel successfully created',
    type: HotelResponseDto,
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
    description: 'Forbidden - Insufficient permissions',
  })
  async create(
    @Body() createHotelDto: CreateHotelDto,
    @ActiveUser() activeUser: ActiveUserType,
  ): Promise<HotelResponseDto> {
    const result = await this.hotelsService.create(createHotelDto, activeUser);
    return result.hotel;
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({
    summary: 'Get all hotels',
    description:
      'Retrieves a list of all hotels. This endpoint is publicly accessible.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of hotels retrieved successfully',
    type: [HotelResponseDto],
  })
  async findAll(): Promise<HotelResponseDto[]> {
    const result = await this.hotelsService.findAll();
    return result.hotels as HotelResponseDto[];
  }
  @Get(':id/staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get hotel staff',
    description:
      'Retrieves staff information for a specific hotel. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Hotel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel staff information retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel not found',
  })
  async getHotelStaff(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.hotelsService.getHotelStaff(id, activeUser);
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({
    summary: 'Get hotel by ID',
    description:
      'Retrieves detailed information about a specific hotel. This endpoint is publicly accessible.',
  })
  @ApiParam({
    name: 'id',
    description: 'Hotel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel information retrieved successfully',
    type: HotelResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HotelResponseDto> {
    const result = await this.hotelsService.findOne(id);
    return result.hotel as HotelResponseDto;
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update hotel',
    description:
      'Updates hotel information. Requires authentication and appropriate permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Hotel ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateHotelDto,
    description: 'Hotel update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel updated successfully',
    type: HotelResponseDto,
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
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHotelDto: UpdateHotelDto,
    @ActiveUser() activeUser: ActiveUserType,
  ): Promise<HotelResponseDto> {
    const result = await this.hotelsService.update(
      id,
      updateHotelDto,
      activeUser,
    );
    return result.hotel;
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete hotel',
    description:
      'Deletes a hotel. Requires authentication and appropriate permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Hotel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Hotel deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
  ) {
    return this.hotelsService.remove(id, activeUser);
  }
}
