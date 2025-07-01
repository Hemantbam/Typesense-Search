/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomModule } from './Modules/Room/room.module';
import { AppDbModule } from 'DbConn/dbConn';

@Module({
  imports: [RoomModule, AppDbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
