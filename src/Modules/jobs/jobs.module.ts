import { Module } from '@nestjs/common';
import { JobsService } from './Service/jobs.service';
import { JobsController } from './Controller/jobs.controller';
import { TypeSenseModule } from 'src/TypeSense/typesense.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { ResponseHandler } from 'src/Utils/responseHandeller';
import { JobEntity } from './Entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
    forwardRef(() => TypeSenseModule),
  ],
  controllers: [JobsController],
  providers: [JobsService, ResponseHandler],
})
export class JobsModule {}
