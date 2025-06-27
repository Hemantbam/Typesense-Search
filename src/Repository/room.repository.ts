import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/Entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async addRoom(roomDetails: Partial<RoomEntity>): Promise<any> {
    try {
      const newRoom = this.roomRepository.create(roomDetails);
      const result = await this.roomRepository.save(newRoom);
      return result ? result : '';
    } catch (error) {
      console.log(error);
    }
  }

  async getRooms(): Promise<RoomEntity[] | null> {
    const getDetails = await this.roomRepository.find();
    return getDetails.length > 0 ? getDetails : null;
  }

  async getAllRooms(): Promise<RoomEntity[] | null> {
    const getDetails = await this.roomRepository.find();
    return getDetails.length > 0 ? getDetails : null;
  }
}
