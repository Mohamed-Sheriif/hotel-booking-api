import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { UserType } from 'src/users/entities/user.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelsRepository: Repository<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto, activeUser: ActiveUserType) {
    if (activeUser.user_type !== UserType.Admin) {
      throw new UnauthorizedException('Only admin can create hotels!');
    }

    // Validate hotel name does not exist
    const hotelExist = await this.hotelsRepository.findOne({
      where: { name: createHotelDto.name },
    });
    if (hotelExist) {
      throw new BadRequestException('Hotel name already exists!');
    }

    const hotel = this.hotelsRepository.create(createHotelDto);
    const saved = await this.hotelsRepository.save(hotel);

    return { status: 'Success', hotel: saved };
  }

  async findAll() {
    const hotels = await this.hotelsRepository.find();
    return { status: 'Success', hotels };
  }

  async findOne(id: number) {
    const hotel = await this.hotelsRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException('Hotel not found!');
    }

    return { status: 'Success', hotel };
  }

  async update(
    id: number,
    updateHotelDto: UpdateHotelDto,
    activeUser: ActiveUserType,
  ) {
    if (activeUser.user_type !== UserType.Staff) {
      throw new UnauthorizedException('Only staff can update hotels!');
    }

    const hotel = await this.hotelsRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException('Hotel not found!');
    }

    Object.assign(hotel, updateHotelDto);
    const saved = await this.hotelsRepository.save(hotel);

    return { status: 'Success', hotel: saved };
  }

  async remove(id: number, activeUser: ActiveUserType) {
    if (activeUser.user_type !== UserType.Admin) {
      throw new UnauthorizedException('Only admin can delete hotels!');
    }

    const hotel = await this.hotelsRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException('Hotel not found!');
    }

    await this.hotelsRepository.remove(hotel);

    return { status: 'Success', hotel };
  }
}
