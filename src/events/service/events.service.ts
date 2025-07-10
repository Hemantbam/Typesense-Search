import { Injectable } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { ServiceResponseDataType } from 'src/utils/apiResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { ResponseHandler } from 'src/utils/responseHandeller';

@Injectable()
export class EventsService {
  constructor(
    private readonly responseHandler: ResponseHandler,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
  ): Promise<ServiceResponseDataType> {
    try {
      const availableEvent = await this.eventRepository.findOne({
        where: {
          title: createEventDto.title,
          date: createEventDto.date,
          latitude: createEventDto.latitude,
          longitude: createEventDto.longitude,
        },
      });

      if (availableEvent) {
        return this.responseHandler.conflictResponse(
          'Event already added to the same location with same date',
        );
      }

      const createEvent = this.eventRepository.create(createEventDto);
      const saveEvent = await this.eventRepository.save(createEvent);

      if (!saveEvent) {
        return this.responseHandler.badRequestResponse(
          'Error in adding a new event',
        );
      }

      return this.responseHandler.successResponse(
        'Event successfully added',
        saveEvent,
      );
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error',
      );
    }
  }

  async findAll(): Promise<ServiceResponseDataType> {
    try {
      const events = await this.eventRepository.find({
        order: { date: 'ASC' },
      });
      return this.responseHandler.successResponse('All events fetched', events);
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Failed to fetch events',
      );
    }
  }

  async findOne(id: string): Promise<ServiceResponseDataType> {
    try {
      const event = await this.eventRepository.findOne({ where: { id } });

      if (!event) {
        return this.responseHandler.notFoundResponse('Event not found');
      }

      return this.responseHandler.successResponse('Event fetched', event);
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Error fetching event',
      );
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<ServiceResponseDataType> {
    try {
      const existingEvent = await this.eventRepository.findOne({
        where: { id },
      });

      if (!existingEvent) {
        return this.responseHandler.notFoundResponse('Event not found');
      }

      const updated = await this.eventRepository.save({
        ...existingEvent,
        ...updateEventDto,
      });

      return this.responseHandler.successResponse('Event updated', updated);
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Error updating event',
      );
    }
  }

  async remove(id: string): Promise<ServiceResponseDataType> {
    try {
      const event = await this.eventRepository.findOne({ where: { id } });

      if (!event) {
        return this.responseHandler.notFoundResponse('Event not found');
      }

      await this.eventRepository.remove(event);

      return this.responseHandler.successResponse('Event deleted', null);
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Error deleting event',
      );
    }
  }
}
