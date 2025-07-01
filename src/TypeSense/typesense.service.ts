import { Injectable, OnModuleInit } from '@nestjs/common';
import Typesense, { Client } from 'typesense';
import { Repository } from 'typeorm';
import { RoomEntity } from 'src/Modules/Room/Entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class TypeSenseService implements OnModuleInit {
  private client: Client;

  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {
    this.client = new Typesense.Client({
      nodes: [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http',
        },
      ],
      apiKey: 'xyz',
      connectionTimeoutSeconds: 2,
    });
  }

  getClient(): Client {
    return this.client;
  }

  async onModuleInit() {
    await this.createOrUpdateRoomCollection();
    await this.syncAllRoomsToTypesense();
  }

  private async createOrUpdateRoomCollection(): Promise<void> {
    const schema = {
      name: 'rooms',
      fields: [
        { name: 'id', type: 'int32' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'location', type: 'string' },
        { name: 'price', type: 'float' },
        { name: 'roomType', type: 'string' },
        { name: 'amenities', type: 'string[]' },
        { name: 'isAvailable', type: 'bool' },
        { name: 'createdAt', type: 'string' },
        { name: 'updatedAt', type: 'string' },
      ],
      default_sorting_field: 'price',
    };

    try {
      await this.client.collections('rooms').retrieve();
      console.log('Collection already exists.');
    } catch {
      await this.client.collections().create(schema as any);
      console.log('Collection created.');
    }
  }
  async syncAllRoomsToTypesense(): Promise<any> {
    try {
      const allRooms = await this.roomRepository.find();

      if (!allRooms || allRooms.length === 0) {
        console.log('No rooms found to index.');
        return;
      }

      const roomPromises = allRooms.map((room) => {
        const formattedRoom = {
          id: room.id.toString(),
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

        return this.indexRoom(formattedRoom);
      });

      await Promise.all(roomPromises);

      console.log('All rooms indexed to Typesense.');
    } catch (error) {
      console.error('Failed to sync rooms:', error);
    }
  }

  async indexRoom(roomData: any): Promise<any> {
    return this.client.collections('rooms').documents().upsert(roomData);
  }

  async searchRooms(query: string): Promise<any[]> {
    const result = await this.client.collections('rooms').documents().search({
      q: query,
      query_by: 'title,description,location,roomType,amenities',
    });

    return result.hits?.map((hit) => hit.document) ?? [];
  }

  async deleteFromTypesense(id: number): Promise<void> {
    try {
      await this.client.collections('rooms').documents(id.toString()).delete();
      console.log(`Room with ID ${id} deleted from Typesense index.`);
    } catch (error) {
      console.error(`Failed to delete room ${id} from Typesense`, error);
    }
  }
}
