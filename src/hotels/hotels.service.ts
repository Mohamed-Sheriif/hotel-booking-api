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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CacheKeys } from 'src/constants/cache-keys';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelsRepository: Repository<Hotel>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

    // Invalidate list cache
    await this.cacheManager.del(CacheKeys.hotelsListAll);

    return { status: 'Success', hotel: saved };
  }

  async findAll() {
    const cacheKey = CacheKeys.hotelsListAll;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return { status: 'Success', hotels: cached };

    const hotels = await this.hotelsRepository.find();
    await this.cacheManager.set(cacheKey, hotels);
    return { status: 'Success', hotels };
  }

  async findOne(id: number) {
    const cacheKey = CacheKeys.hotelById(id);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return { status: 'Success', hotel: cached };

    const hotel = await this.hotelsRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found!');
    }

    await this.cacheManager.set(cacheKey, hotel);
    return { status: 'Success', hotel };
  }

  async update(
    id: number,
    updateHotelDto: UpdateHotelDto,
    activeUser: ActiveUserType,
  ) {
    if (activeUser.user_type !== UserType.Staff && activeUser.hotel_id !== id) {
      throw new UnauthorizedException(
        'Only staff that assigned to this hotel can update!',
      );
    }

    const hotel = await this.hotelsRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException('Hotel not found!');
    }

    Object.assign(hotel, updateHotelDto);
    const saved = await this.hotelsRepository.save(hotel);

    await Promise.all([
      this.cacheManager.del(CacheKeys.hotelById(id)),
      this.cacheManager.del(CacheKeys.hotelsListAll),
    ]);

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
    await Promise.all([
      this.cacheManager.del(CacheKeys.hotelById(id)),
      this.cacheManager.del(CacheKeys.hotelsListAll),
    ]);
    return { status: 'Success', hotel };
  }
}
