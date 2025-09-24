import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CacheKeys } from 'src/constants/cache-keys';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';
import { UpdateRoomDto } from 'src/rooms/dto/update-room.dto';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { UserType } from 'src/users/entities/user.entity';
import { RoomTypesService } from 'src/room-types/room-types.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    private readonly roomTypeService: RoomTypesService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private ensureHotelScope(user: ActiveUserType, hotel_id: number) {
    if (!user.hotel_id || user.hotel_id !== hotel_id) {
      throw new UnauthorizedException('Action not allowed for this hotel');
    }
  }

  private ensureMutationRole(user: ActiveUserType) {
    if (user.user_type !== UserType.Staff) {
      throw new UnauthorizedException('Only staff can modify rooms');
    }
  }

  async create(createRoomDto: CreateRoomDto, user: ActiveUserType) {
    // Check if user is staff
    this.ensureMutationRole(user);

    // Ensure user belong to this hotel
    this.ensureHotelScope(user, createRoomDto.hotel_id ?? 0);

    // Ensure room type exist
    const roomType = await this.roomTypeService.findOne(
      createRoomDto.room_type_id,
      user,
    );
    if (!roomType) {
      throw new NotFoundException('Room Type not found');
    }

    const entity = this.roomsRepository.create({
      ...createRoomDto,
      hotel_id: user.hotel_id,
    });

    return await this.roomsRepository.save(entity);
  }

  async findAllForHotel(hotelId: number) {
    const cacheKey = CacheKeys.roomsByHotel(hotelId);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as Room[];

    const rooms = await this.roomsRepository.find({
      where: { hotel_id: hotelId },
    });
    await this.cacheManager.set(cacheKey, rooms);
    return rooms;
  }

  async findOne(id: number) {
    const cacheKey = CacheKeys.roomById(id);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as Room;

    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });
    if (!room) throw new NotFoundException('Room not found');

    await this.cacheManager.set(cacheKey, room);
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto, user: ActiveUserType) {
    // Check if user is staff
    this.ensureMutationRole(user);

    // Check if room exist
    const existing = await this.roomsRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Room not found');
    } else {
      // Check if he is trying to move the room to another hotel
      if (
        updateRoomDto.hotel_id &&
        updateRoomDto.hotel_id !== existing.hotel_id
      ) {
        throw new UnauthorizedException('Cannot move room to another hotel');
      }
    }

    // Ensure user belong to this hotel
    this.ensureHotelScope(user, existing.hotel_id);

    Object.assign(existing, updateRoomDto);

    const saved = await this.roomsRepository.save(existing);
    await Promise.all([
      this.cacheManager.del(CacheKeys.roomById(id)),
      this.cacheManager.del(CacheKeys.roomsByHotel(existing.hotel_id)),
    ]);
    return saved;
  }

  async remove(id: number, user: ActiveUserType) {
    // Check if user is staff
    this.ensureMutationRole(user);

    // Check if room exist
    const existing = await this.roomsRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Room not found');
    }

    // Ensure user belong to this hotel
    this.ensureHotelScope(user, existing.hotel_id);

    await this.roomsRepository.remove(existing);

    await Promise.all([
      this.cacheManager.del(CacheKeys.roomById(id)),
      this.cacheManager.del(CacheKeys.roomsByHotel(existing.hotel_id)),
    ]);

    return { success: true };
  }
}
