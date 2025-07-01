import { Injectable } from '@nestjs/common';
import { ResponseHandler } from 'src/Utils/responseHandeller';
import { RoomDto } from '../Dto/room.dto';
import { ServiceResponseDataType } from 'src/Utils/apiResponse';
import { TypeSenseService } from 'src/TypeSense/typesense.service';
import { Repository } from 'typeorm';
import { RoomEntity } from 'src/Modules/Room/Entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomService {
  constructor(
    private readonly responseHandler: ResponseHandler,
    private readonly typeSenseSearch: TypeSenseService,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async addRoom(roomDto: RoomDto): Promise<ServiceResponseDataType> {
    try {
      if (!roomDto) {
        return this.responseHandler.badRequestResponse(
          'Please enter all details of the room',
        );
      }
      const newRoom = this.roomRepository.create(roomDto);
      const resultDb = await this.roomRepository.save(newRoom);

      if (!resultDb) {
        return this.responseHandler.badRequestResponse(
          'Bad request, try again',
        );
      }

      await this.typeSenseSearch.indexRoom({
        id: resultDb.id.toString(),
        title: resultDb.title,
        description: resultDb.description,
        location: resultDb.location,
        price: resultDb.price,
        roomType: resultDb.roomType,
        amenities: resultDb.amenities,
        isAvailable: resultDb.isAvailable,
        createdAt: resultDb.createdAt.toISOString(),
        updatedAt: resultDb.updatedAt.toISOString(),
      });

      return this.responseHandler.successResponse(
        'A new room detail added and indexed successfully',
      );
    } catch (error) {
      console.error('Add room error:', error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal Server Error',
      );
    }
  }

  async syncAllRoomsToTypesense(): Promise<void> {
    try {
      const allRooms = await this.roomRepository.find();

      if (!allRooms || allRooms.length === 0) {
        console.log('No rooms found to index.');
        return;
      }

      const roomPromises = allRooms.map((room) => {
        const formattedRoom = {
          id: room.id,
          title: room.title,
          description: room.description,
          location: room.location,
          price: room.price,
          roomType: room.roomType,
          amenities: room.amenities,
          isAvailable: room.isAvailable,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        };

        return this.typeSenseSearch.indexRoom(formattedRoom);
      });

      await Promise.all(roomPromises);

      console.log('All rooms indexed to Typesense.');
    } catch (error) {
      console.error('Failed to sync rooms:', error);
    }
  }

  async getRoom(query: string): Promise<ServiceResponseDataType> {
    if (!query || query.trim() === '') {
      const allRooms = await this.roomRepository.find();
      return this.responseHandler.successResponse(
        'All room data fetched',
        allRooms,
      );
    }

    try {
      console.log(query);
      const searchResults = await this.typeSenseSearch
        .getClient()
        .collections('rooms')
        .documents()
        .search({
          q: query,
          query_by: 'title,description,location,roomType,amenities',
        });

      const rooms = searchResults.hits?.map((hit) => hit.document);

      return this.responseHandler.successResponse(
        `Search results for: "${query}"`,
        rooms,
      );
    } catch (error) {
      console.error('Typesense search error:', error);
      return this.responseHandler.unexpectedErrorResponse(
        'Error while searching rooms',
      );
    }
  }
}
