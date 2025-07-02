import { Module, forwardRef } from '@nestjs/common';
import { TypeSenseService } from './typesense.service';
import { RoomModule } from 'src/Modules/Room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/Modules/Room/Entities/room.entity';
import { JobEntity } from 'src/Modules/jobs/Entities/job.entity';
import { JobsModule } from 'src/Modules/jobs/jobs.module';

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
