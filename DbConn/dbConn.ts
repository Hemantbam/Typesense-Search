import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'src/events/entities/event.entity';
import { JobEntity } from 'src/jobs/entities/job.entity';
import { RoomEntity } from 'src/room/entities/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.db',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [RoomEntity, JobEntity, User, EventEntity],
        synchronize: false,
      }),
    }),
  ],
})
export class AppDbModule {}
