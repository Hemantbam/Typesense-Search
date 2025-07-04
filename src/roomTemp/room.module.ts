import { Module, forwardRef } from '@nestjs/common';
import { RoomController } from './controller/room.controller';
import { RoomService } from './service/room.service';
import { ResponseHandler } from 'src/utilsTemp/responseHandeller';
import { RoomEntity } from 'src/roomTemp/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeSenseModule } from 'src/typesenseTemp/typesense.module';

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
