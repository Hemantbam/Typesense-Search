import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'])
  employment_type:
    | 'Full-time'
    | 'Part-time'
    | 'Contract'
    | 'Internship'
    | 'Temporary';

  @IsNumber()
  hourly_pay: number;

  @IsBoolean()
  @IsOptional()
  urgent_hiring?: boolean;

  @IsBoolean()
  @IsOptional()
  remote_option?: boolean;

  @IsString()
  @IsOptional()
  experience_required?: string;

  @IsString()
  @IsOptional()
  education_level?: string;

  @IsDateString()
  @IsOptional()
  application_deadline?: string;

  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsLongitude()
  @IsOptional()
  longitude?: number;
}
