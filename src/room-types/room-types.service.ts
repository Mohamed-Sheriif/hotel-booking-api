import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from './entities/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { UserType } from 'src/users/entities/user.entity';

@Injectable()
export class RoomTypesService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypesRepository: Repository<RoomType>,
  ) {}

  async create(createDto: CreateRoomTypeDto, user: ActiveUserType) {
    if (user.user_type !== UserType.Staff) {
      throw new UnauthorizedException('Only staff can create room types!');
    }

    const entity = this.roomTypesRepository.create(createDto);

    return await this.roomTypesRepository.save(entity);
  }

  async findAll(user: ActiveUserType) {
    if (user.user_type !== UserType.Staff) {
      throw new UnauthorizedException('Only staff can create room types!');
    }
    return await this.roomTypesRepository.find();
  }

  async findOne(id: number, user: ActiveUserType) {
    if (user.user_type !== UserType.Staff) {
      throw new UnauthorizedException('Only staff can create room types!');
    }

    const found = await this.roomTypesRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Room type not found');

    return found;
  }

  async update(id: number, updateDto: UpdateRoomTypeDto, user: ActiveUserType) {
    if (user.user_type !== UserType.Staff) {
      throw new UnauthorizedException('Only staff can create room types!');
    }

    const existing = await this.roomTypesRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Room type not found');
    }

    Object.assign(existing, updateDto);

    return await this.roomTypesRepository.save(existing);
  }

  async remove(id: number, user: ActiveUserType) {
    if (user.user_type !== UserType.Staff) {
      throw new UnauthorizedException('Only staff can create room types!');
    }

    const existing = await this.roomTypesRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Room type not found');
    }

    await this.roomTypesRepository.remove(existing);

    return { success: true };
  }
}
