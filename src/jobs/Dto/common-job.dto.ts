import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';


export class SearchJobDto {
  @IsOptional()
  @IsString()
  q: string;
}

export class JobIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
