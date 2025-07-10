import { Module } from '@nestjs/common';
import { EventsService } from './service/events.service';
import { EventsController } from './controller/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { ResponseHandler } from 'src/utils/responseHandeller';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  controllers: [EventsController],
  providers: [EventsService, ResponseHandler],
})
export class EventsModule {}
