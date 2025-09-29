/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { UserType } from 'src/users/entities/user.entity';
import { HotelsService } from 'src/hotels/hotels.service';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { ReservationsService } from 'src/reservations/reservations.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    private readonly hotelsService: HotelsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    activeUser: ActiveUserType,
  ): Promise<Review> {
    // Only customers can create reviews
    if (activeUser.user_type !== UserType.Customer) {
      throw new ForbiddenException('Only customers can create reviews');
    }

    const { hotel_id, reservation_id, rating, title, comment } =
      createReviewDto;

    // Check if user has a reservation for this hotel
    await this.validateReservationOwnership(
      reservation_id,
      hotel_id,
      activeUser.sub,
    );

    // Check if review already exists for this reservation
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user_id: activeUser.sub,
        reservation_id,
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'You have already reviewed this reservation',
      );
    }

    // Create the review
    const review = this.reviewRepository.create({
      user_id: activeUser.sub,
      hotel_id,
      reservation_id,
      rating,
      title,
      comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update hotel rating
    await this.updateHotelRating(hotel_id);

    return this.findOne(savedReview.id);
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'hotel', 'reservation'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByHotel(hotelId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { hotel_id: hotelId },
      relations: ['user', 'hotel', 'reservation'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user_id: userId },
      relations: ['user', 'hotel', 'reservation'],
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    activeUser: ActiveUserType,
  ): Promise<Review> {
    const review = await this.findOne(id);

    // Check if user can update this review
    if (
      activeUser.user_type === UserType.Customer &&
      review.user_id !== activeUser.sub
    ) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    // Staff can update any review
    if (
      activeUser.user_type !== UserType.Customer &&
      activeUser.user_type !== UserType.Staff
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to update reviews',
      );
    }

    // Update the review
    Object.assign(review, updateReviewDto);
    const updatedReview = await this.reviewRepository.save(review);

    // Update hotel rating if rating changed
    if (updateReviewDto.rating) {
      await this.updateHotelRating(review.hotel_id);
    }

    return this.findOne(updatedReview.id);
  }

  async remove(id: number, activeUser: ActiveUserType): Promise<void> {
    const review = await this.findOne(id);

    // Check if user can delete this review
    if (
      activeUser.user_type === UserType.Customer &&
      review.user_id !== activeUser.sub
    ) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    // Staff and Admin can delete any review
    if (
      activeUser.user_type !== UserType.Customer &&
      activeUser.user_type !== UserType.Staff &&
      activeUser.user_type !== UserType.Admin
    ) {
      throw new ForbiddenException(
        'Insufficient permissions to delete reviews',
      );
    }

    await this.reviewRepository.remove(review);

    // Update hotel rating after deletion
    await this.updateHotelRating(review.hotel_id);
  }

  private async validateReservationOwnership(
    reservationId: number,
    hotelId: number,
    userId: number,
  ) {
    // Validate existence and ownership using ReservationsService
    const reservation = await this.reservationsService.findOne(reservationId, {
      sub: userId,
      user_type: UserType.Customer,
    } as ActiveUserType);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.customer_id !== userId) {
      throw new ForbiddenException('You can only review your own reservation');
    }

    // Ensure reservation belongs to the provided hotel
    if (reservation.room?.hotel_id && reservation.room.hotel_id !== hotelId) {
      throw new BadRequestException(
        'Reservation does not belong to the specified hotel',
      );
    }

    return reservation;
  }

  private async updateHotelRating(hotelId: number): Promise<void> {
    // Calculate average rating for the hotel
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.hotel_id = :hotelId', { hotelId })
      .getRawOne();

    const averageRating = parseFloat(result.averageRating) || 0;
    const totalReviews = parseInt(result.totalReviews) || 0;

    // Update hotel with new rating
    await this.hotelRepository.update(hotelId, {
      average_rating: averageRating.toFixed(2),
      review_count: totalReviews,
    });

    console.log(
      `Hotel ${hotelId} updated: Average rating: ${averageRating.toFixed(2)}, Total reviews: ${totalReviews}`,
    );
  }
}
