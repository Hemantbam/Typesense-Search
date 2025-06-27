import { Module, forwardRef } from '@nestjs/common';
import { RoomController } from './Controller/room.controller';
import { RoomService } from './Service/room.service';
import { RoomRepository } from 'src/Repository/room.repository';
import { ResponseHandler } from 'src/Utils/responseHandeller';
import { RoomEntity } from 'src/Entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeSenseModule } from 'src/TypeSense/typesense.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    forwardRef(() => TypeSenseModule),
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomRepository, ResponseHandler],
  exports: [RoomRepository],
})
export class RoomModule {}
