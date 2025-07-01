/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomModule } from './Modules/Room/room.module';
import { AppDbModule } from 'DbConn/dbConn';
import { JobsModule } from './Modules/jobs/jobs.module';
@Module({
  imports: [RoomModule, AppDbModule, JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
