import { Module, forwardRef } from '@nestjs/common';
import { TypeSenseService } from './typesense.service';
import { RoomModule } from 'src/Modules/Room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/Modules/Room/Entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    forwardRef(() => RoomModule),
  ],
  providers: [TypeSenseService],
  exports: [TypeSenseService],
})
export class TypeSenseModule {}
