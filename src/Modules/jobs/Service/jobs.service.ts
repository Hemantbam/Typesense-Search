import { Injectable } from '@nestjs/common';
import { CreateJobDto } from '../Dto/create-job.dto';
import { UpdateJobDto } from '../Dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from '../Entities/job.entity';
import { Repository } from 'typeorm';
import { ResponseHandler } from 'src/Utils/responseHandeller';
import { ServiceResponseDataType } from 'src/Utils/apiResponse';
import { TypeSenseService } from 'src/TypeSense/typesense.service';
@Injectable()
export class JobsService {
  constructor(
    private readonly responseHandler: ResponseHandler,
    private readonly typeSenseService: TypeSenseService,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<ServiceResponseDataType> {
    try {
      const addJobDb = this.jobRepository.create(createJobDto);
      const dbResult = await this.jobRepository.save(addJobDb);

      if (!dbResult) {
        return this.responseHandler.badRequestResponse(
          'Error in adding a new details',
        );
      }
      await this.typeSenseService.indexJobs({
        id: dbResult.id.toString(),
        title: dbResult.title,
        company_name: dbResult.company_name,
        location: dbResult.location,
        description: dbResult.description,
        employment_type: dbResult.employment_type,
        hourly_pay: dbResult.hourly_pay,
        urgent_hiring: dbResult.urgent_hiring,
        remote_option: dbResult.remote_option,
        experience_required: dbResult.experience_required || '',
        education_level: dbResult.education_level || '',
        application_deadline:
          dbResult.application_deadline?.toISOString() || '',
        posted_at: dbResult.posted_at.toISOString(),
        updated_at: dbResult.updated_at.toISOString(),
      });
      return this.responseHandler.successResponse('A new job is added');
    } catch (error) {
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error',
      );
    }
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
