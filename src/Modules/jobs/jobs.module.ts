import { Module } from '@nestjs/common';
import { JobsService } from './Service/jobs.service';
import { JobsController } from './Controller/jobs.controller';
import { JobEntity } from './entities/job.entity';
import { TypeSenseModule } from 'src/TypeSense/typesense.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { ResponseHandler } from 'src/Utils/responseHandeller';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
    forwardRef(() => TypeSenseModule),
  ],
  controllers: [JobsController],
  providers: [JobsService, ResponseHandler],
})
export class JobsModule {}
