import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { UserType } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { RoomType } from 'src/room-types/entities/room-type.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
  ) {}

  private assertCustomer(user: ActiveUserType) {
    if (user.user_type !== UserType.Customer) {
      throw new ForbiddenException('Only customers can create reservations');
    }
  }

  private assertStaff(user: ActiveUserType) {
    if (user.user_type !== UserType.Staff) {
      throw new ForbiddenException('Only hotel staff can perform this action');
    }
  }

  private validateDates(checkIn: string, checkOut: string) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inDate < today) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }
    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
      throw new BadRequestException('Invalid check-in or check-out date');
    }
    if (outDate <= inDate) {
      throw new BadRequestException(
        'check_out_date must be after check_in_date',
      );
    }
  }

  private async assertRoomExistsAndCapacity(roomId: number, guests: number) {
    const room = await this.roomRepo.findOne({
      where: { id: roomId },
      relations: ['room_type'],
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const capacity = room.room_type.capacity;
    if (guests > capacity) {
      throw new BadRequestException('Number of guests exceeds room capacity');
    }
    return room;
  }

  private async isRoomAvailable(
    roomId: number,
    checkIn: string,
    checkOut: string,
    ignoreReservationId?: number,
  ) {
    // Overlap exists if: start < existing_end AND end > existing_start
    const overlapping = await this.reservationRepo
      .createQueryBuilder('r')
      .where('r.room_id = :roomId', { roomId })
      .andWhere('r.status IN (:...activeStatuses)', {
        activeStatuses: [
          ReservationStatus.Confirmed,
          ReservationStatus.Confirmed,
        ],
      })
      .andWhere('r.check_in_date < :checkOut AND r.check_out_date > :checkIn', {
        checkIn,
        checkOut,
      })
      .andWhere(ignoreReservationId ? 'r.id != :ignoreId' : '1=1', {
        ignoreId: ignoreReservationId,
      })
      .getCount();
    return overlapping === 0;
  }

  private calculateTotalPrice(
    basePrice: string,
    checkIn: string,
    checkOut: string,
  ): string {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const msInDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / msInDay);
    const total = parseFloat(basePrice) * nights;
    return total.toFixed(2);
  }

  async create(dto: CreateReservationDto, user: ActiveUserType) {
    this.assertCustomer(user);

    this.validateDates(dto.check_in_date, dto.check_out_date);

    const room = await this.assertRoomExistsAndCapacity(
      dto.room_id,
      dto.number_of_guests,
    );

    const available = await this.isRoomAvailable(
      dto.room_id,
      dto.check_in_date,
      dto.check_out_date,
    );
    if (!available) {
      throw new BadRequestException(
        'Room is not available for the selected dates',
      );
    }

    const basePrice = room.room_type.base_price;
    const total = this.calculateTotalPrice(
      basePrice,
      dto.check_in_date,
      dto.check_out_date,
    );

    const reservation = this.reservationRepo.create({
      customer_id: user.sub,
      room_id: dto.room_id,
      check_in_date: dto.check_in_date,
      check_out_date: dto.check_out_date,
      number_of_guests: dto.number_of_guests,
      total_price: total,
      status: ReservationStatus.Pending,
    });

    return this.reservationRepo.save(reservation);
  }

  async findAll(user: ActiveUserType) {
    // Staff: all reservations for their hotel
    this.assertStaff(user);
    return this.reservationRepo
      .createQueryBuilder('r')
      .innerJoin(Room, 'room', 'room.id = r.room_id')
      .where('room.hotel_id = :hotelId', { hotelId: user.hotel_id })
      .getMany();
  }

  async findRoomReservations(roomId: number, user: ActiveUserType) {
    this.assertStaff(user);

    // Ensure room belongs to staff's hotel
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    if (room.hotel_id !== user.hotel_id)
      throw new ForbiddenException(
        'You are not allowed to see other hotels info!',
      );

    return this.reservationRepo.find({ where: { room_id: roomId } });
  }

  async getCustomerReservations(customerId: number, user: ActiveUserType) {
    // Customer can only see their own reservations
    if (user.user_type === UserType.Customer) {
      if (user.sub !== customerId) {
        throw new ForbiddenException('You can only view your own reservations');
      }
      return this.reservationRepo.find({
        where: { customer_id: customerId },
        relations: ['room', 'room.room_type'],
      });
    }

    // Staff can only see reservations for customers who have reservations at their hotel
    this.assertStaff(user);
    return this.reservationRepo
      .createQueryBuilder('r')
      .innerJoin(Room, 'room', 'room.id = r.room_id')
      .leftJoin('room.room_type', 'roomType')
      .where('r.customer_id = :customerId', { customerId })
      .andWhere('room.hotel_id = :hotelId', { hotelId: user.hotel_id })
      .getMany();
  }

  async findOne(id: number, user: ActiveUserType) {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Reservation not found');

    // Customer cant see other reservations
    if (user.user_type === UserType.Customer && res.customer_id !== user.sub) {
      throw new ForbiddenException();
    }

    if (user.user_type == UserType.Staff) {
      // staff must belong to same hotel as the room
      const room = await this.roomRepo.findOne({ where: { id: res.room_id } });
      if (!room || room.hotel_id !== user.hotel_id)
        throw new ForbiddenException();
    }
    return res;
  }

  async update(id: number, dto: UpdateReservationDto, user: ActiveUserType) {
    const existing = await this.reservationRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Reservation not found');

    // Authorization: customer can update only own
    if (user.user_type === UserType.Customer) {
      if (existing.customer_id !== user.sub) throw new ForbiddenException();
    }

    // Check if reservation is confirmed
    if (existing.status === ReservationStatus.Confirmed) {
      throw new ForbiddenException(
        "Reservation is confirmed , can't be updated!",
      );
    }

    // If dates/room/guests change, revalidate
    const next = { ...existing, ...dto } as Reservation;
    if (dto.check_in_date || dto.check_out_date) {
      this.validateDates(next.check_in_date, next.check_out_date);
    }
    if (dto.room_id || dto.number_of_guests) {
      const room = await this.assertRoomExistsAndCapacity(
        next.room_id,
        next.number_of_guests,
      );
      const available = await this.isRoomAvailable(
        next.room_id,
        next.check_in_date,
        next.check_out_date,
        existing.id,
      );
      if (!available)
        throw new BadRequestException(
          'Room is not available for the selected dates',
        );
      // Recalculate total price if dates changed or room changed
      if (dto.check_in_date || dto.check_out_date || dto.room_id) {
        next.total_price = this.calculateTotalPrice(
          room.room_type.base_price,
          next.check_in_date,
          next.check_out_date,
        );
      }
    }

    await this.reservationRepo.update({ id }, next);
    return this.findOne(id, user);
  }

  async remove(id: number, user: ActiveUserType) {
    const existing = await this.reservationRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Reservation not found');

    // Authorization: customer can update only own
    if (user.user_type === UserType.Customer) {
      if (existing.customer_id !== user.sub) throw new ForbiddenException();
    }

    // Check if reservation is confirmed
    if (existing.status === ReservationStatus.Confirmed) {
      throw new ForbiddenException(
        "Reservation is confirmed , can't be cancelled!",
      );
    }

    await this.reservationRepo.delete({ id });

    return { success: true };
  }
}
