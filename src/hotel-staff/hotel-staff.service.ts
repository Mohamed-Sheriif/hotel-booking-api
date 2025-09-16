import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelStaff } from './entities/hotel-staff.entity';
import { AssignStaffDto } from './dto/assign-staff.dto';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { UserType, User } from 'src/users/entities/user.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Injectable()
export class HotelStaffService {
  constructor(
    @InjectRepository(HotelStaff)
    private readonly hotelStaffRepository: Repository<HotelStaff>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Hotel)
    private readonly hotelsRepository: Repository<Hotel>,
  ) {}

  async assignStaffToHotel(dto: AssignStaffDto) {
    const user = await this.usersRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const hotel = await this.hotelsRepository.findOne({
      where: { id: dto.hotelId },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found!');
    }

    const existing = await this.hotelStaffRepository.findOne({
      where: { user: { id: dto.userId } },
    });
    if (existing) {
      throw new BadRequestException('User is already assigned to a hotel!');
    }

    const staff = this.hotelStaffRepository.create({
      user,
      hotel,
      position: dto.position ?? null,
      is_active: true,
    });

    return await this.hotelStaffRepository.save(staff);
  }

  async getHotelStaffByUserId(userId: number) {
    const staff = await this.hotelStaffRepository.findOne({
      where: { user: { id: userId } },
    });

    return staff;
  }

  async removeStaffFromHotel(staffId: number, activeUser: ActiveUserType) {
    if (activeUser.user_type !== UserType.Admin) {
      throw new UnauthorizedException('Only admin can remove staff!');
    }

    const staff = await this.hotelStaffRepository.findOne({
      where: { id: staffId },
    });
    if (!staff) {
      throw new NotFoundException('Staff assignment not found!');
    }

    await this.hotelStaffRepository.remove(staff);
    return { status: 'Success', staff };
  }

  async listHotelStaff(hotelId: number) {
    const hotel = await this.hotelsRepository.findOne({
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found!');
    }

    const staff = await this.hotelStaffRepository.find({
      where: { hotel: { id: hotelId } },
    });

    return { status: 'Success', staff };
  }
}
