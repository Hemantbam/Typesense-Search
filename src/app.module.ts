/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { AppDbModule } from 'DbConn/dbConn';
import { JobsModule } from './jobs/jobs.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
@Module({
  imports: [
    RoomModule,
    AppDbModule,
    JobsModule,
    UserModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
