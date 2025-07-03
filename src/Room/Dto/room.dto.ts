/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDate,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  roomType: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}

export class SearchRoomDto {
  @IsOptional()
  @IsString()
  q?: string;
}

export class RoomIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id?: number;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
