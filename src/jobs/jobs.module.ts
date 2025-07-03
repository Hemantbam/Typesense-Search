import { Module } from '@nestjs/common';
import { JobsService } from './service/jobs.service';
import { JobsController } from './controller/jobs.controller';
import { TypeSenseModule } from 'src/typeSense/typesense.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { ResponseHandler } from 'src/utils/responseHandeller';
import { JobEntity } from './entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
    forwardRef(() => TypeSenseModule),
  ],
  controllers: [JobsController],
  providers: [JobsService, ResponseHandler],
})
export class JobsModule {}
