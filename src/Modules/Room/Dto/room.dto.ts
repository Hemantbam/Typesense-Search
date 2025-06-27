/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/Dto/room.dto.ts
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RoomDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsNumber()
  price: number;

  @IsString()
  roomType: string;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsBoolean()
  isAvailable: boolean;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

export class SearchRoomDto {
  @IsOptional()
  @IsString()
  q?: string;
}
