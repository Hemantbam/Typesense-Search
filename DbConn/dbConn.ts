import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/Modules/Room/Entities/room.entity';

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
        entities: [RoomEntity],
        synchronize: false,
      }),
    }),
  ],
})
export class AppDbModule {}
