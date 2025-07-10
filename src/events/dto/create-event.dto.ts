import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Latitude must be a number' })
  @IsLatitude({ message: 'Invalid latitude value' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Longitude must be a number' })
  @IsLongitude({ message: 'Invalid longitude value' })
  @IsOptional()
  longitude?: number;

  @IsDateString({}, { message: 'Date must be in YYYY-MM-DD format' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;
}
