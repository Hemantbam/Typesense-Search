import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from '../service/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import {
  ControllerResponse,
  ControllerResponseDataType,
} from 'src/utils/apiResponse';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.eventsService.create(createEventDto);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Get()
  async findAll(): Promise<ControllerResponseDataType> {
    const result = await this.eventsService.findAll();
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ControllerResponseDataType> {
    const result = await this.eventsService.findOne(id);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.eventsService.update(id, updateEventDto);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ControllerResponseDataType> {
    const result = await this.eventsService.remove(id);
    return ControllerResponse(result.status, result.message, result.details);
  }
}
