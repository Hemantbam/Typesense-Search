import { Module, forwardRef } from '@nestjs/common';
import { TypeSenseService } from './typesense.service';
import { RoomModule } from 'src/room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entities/room.entity';
import { JobEntity } from 'src/jobs/entities/job.entity';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity, JobEntity]),
    forwardRef(() => RoomModule),
    forwardRef(() => JobsModule),
  ],
  providers: [TypeSenseService],
  exports: [TypeSenseService],
})
export class TypeSenseModule {}
