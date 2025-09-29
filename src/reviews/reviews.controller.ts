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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { AllowAnonymous } from 'src/auth/decorator/allow-anonymous.decorator';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new review',
    description:
      'Creates a new review for a hotel. Only customers can create reviews for their own reservations.',
  })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Review creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or review already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only customers can create reviews',
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel or reservation not found',
  })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReviewResponseDto> {
    const result = await this.reviewsService.create(createReviewDto, user);
    return result as ReviewResponseDto;
  }

  @AllowAnonymous()
  @Get('hotel/:hotelId')
  @ApiOperation({
    summary: 'Get reviews for a hotel',
    description:
      'Retrieves all reviews for a specific hotel. This endpoint is publicly accessible.',
  })
  @ApiParam({
    name: 'hotelId',
    description: 'Hotel ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of hotel reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Hotel not found',
  })
  async findByHotel(
    @Param('hotelId', ParseIntPipe) hotelId: number,
  ): Promise<ReviewResponseDto[]> {
    const result = await this.reviewsService.findByHotel(hotelId);
    return result as ReviewResponseDto[];
  }

  @Get('user/:userId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get reviews by a user',
    description:
      'Retrieves all reviews written by a specific user. Requires authentication.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of user reviews retrieved successfully',
    type: [ReviewResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ReviewResponseDto[]> {
    const result = await this.reviewsService.findByUser(userId);
    return result as ReviewResponseDto[];
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({
    summary: 'Get review by ID',
    description:
      'Retrieves detailed information about a specific review. This endpoint is publicly accessible.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Review information retrieved successfully',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewResponseDto> {
    const result = await this.reviewsService.findOne(id);
    return result as ReviewResponseDto;
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update review',
    description:
      'Updates review information. Customers can only update their own reviews, staff can update any review.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateReviewDto,
    description: 'Review update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewResponseDto,
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
    description: 'Forbidden - Can only update own reviews',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @ActiveUser() user: ActiveUserType,
  ): Promise<ReviewResponseDto> {
    const result = await this.reviewsService.update(id, updateReviewDto, user);
    return result as ReviewResponseDto;
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete review',
    description:
      'Deletes a review. Review owners and staff can delete reviews.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Can only delete own reviews or staff access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserType,
  ): Promise<void> {
    return this.reviewsService.remove(id, user);
  }
}
