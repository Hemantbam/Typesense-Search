import { Injectable, OnModuleInit } from '@nestjs/common';
import Typesense, { Client } from 'typesense';
import { Repository } from 'typeorm';
import { RoomEntity } from 'src/room/entities/entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from 'src/jobs/entities/job.entity';
@Injectable()
export class TypeSenseService implements OnModuleInit {
  private client: Client;

  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
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
    await this.createOrUpdateJobCollection();
    await this.syncAllJobsToTypesense();
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

  //Jobs
  private async createOrUpdateJobCollection(): Promise<void> {
    const schema = {
      name: 'jobs',
      fields: [
        { name: 'id', type: 'int32' },
        { name: 'title', type: 'string' },
        { name: 'company_name', type: 'string' },
        { name: 'location', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'employment_type', type: 'string' },
        { name: 'hourly_pay', type: 'float' },
        { name: 'urgent_hiring', type: 'bool' },
        { name: 'remote_option', type: 'bool' },
        { name: 'experience_required', type: 'string', optional: true },
        { name: 'education_level', type: 'string', optional: true },
        { name: 'application_deadline', type: 'string', optional: true },
        { name: 'posted_at', type: 'int64' },
        { name: 'updated_at', type: 'int64' },
        { name: '_geo', type: 'geopoint' },
      ],
      default_sorting_field: 'posted_at',
    };

    try {
      await this.client.collections('jobs').retrieve();
      const collection = await this.client.collections('jobs').retrieve();
      console.log(collection.fields);
      console.log('Jobs collection already exists.');
    } catch {
      await this.client.collections().create(schema as any);
      console.log('Jobs collection created.');
    }
  }

  async syncAllJobsToTypesense(): Promise<void> {
    try {
      const allJobs = await this.jobRepository.find();

      if (!allJobs || allJobs.length === 0) {
        console.log('No jobs found to index.');
        return;
      }

      const jobPromises = allJobs.map((job) => {
        const formattedJob = {
          id: job.id.toString(),
          title: job.title,
          company_name: job.company_name,
          location: job.location,
          description: job.description,
          employment_type: job.employment_type,
          hourly_pay: parseFloat(job.hourly_pay as any),
          urgent_hiring: job.urgent_hiring,
          remote_option: job.remote_option,
          experience_required: job.experience_required || '',
          education_level: job.education_level || '',
          application_deadline: job.application_deadline
            ? new Date(job.application_deadline).toISOString()
            : '',
          posted_at: new Date(job.posted_at).getTime(),
          updated_at: new Date(job.updated_at).getTime(),
          _geo: [Number(job.latitude) || 0, Number(job.longitude) || 0],
        };
        return this.indexJobs(formattedJob);
      });

      await Promise.all(jobPromises);

      console.log('All jobs indexed to Typesense.');
    } catch (error) {
      console.error('Failed to sync jobs:', error);
    }
  }

  async indexJobs(jobData: any): Promise<any> {
    return this.client.collections('jobs').documents().upsert(jobData);
  }
}
