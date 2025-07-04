/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomModule } from './roomTemp/room.module';
import { AppDbModule } from 'DbConn/dbConn';
import { JobsModule } from './jobs/jobs.module';
@Module({
  imports: [RoomModule, AppDbModule, JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
