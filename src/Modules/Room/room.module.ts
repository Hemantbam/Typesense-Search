import { Module, forwardRef } from '@nestjs/common';
import { RoomController } from './Controller/room.controller';
import { RoomService } from './Service/room.service';
import { ResponseHandler } from 'src/Utils/responseHandeller';
import { RoomEntity } from 'src/Modules/Room/Entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeSenseModule } from 'src/TypeSense/typesense.module';

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
