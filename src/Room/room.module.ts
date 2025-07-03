import { Module, forwardRef } from '@nestjs/common';
import { RoomController } from './controller/room.controller';
import { RoomService } from './service/room.service';
import { ResponseHandler } from 'src/utils/responseHandeller';
import { RoomEntity } from 'src/room/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeSenseModule } from 'src/typeSense/typesense.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    forwardRef(() => TypeSenseModule),
  ],
  controllers: [RoomController],
  providers: [RoomService, ResponseHandler],
  exports: [],
})
export class RoomModule {}
