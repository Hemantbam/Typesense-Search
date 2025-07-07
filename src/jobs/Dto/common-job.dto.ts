import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class SearchJobDto {
  @IsOptional()
  @IsString()
  q: string;

  @IsOptional()
  @IsLatitude()
  @Type(() => Number)
  lat?: number;

  @IsOptional()
  @IsLongitude()
  @Type(() => Number)
  lng?: number;
}

export class JobIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
