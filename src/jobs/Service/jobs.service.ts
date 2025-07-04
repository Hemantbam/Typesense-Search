import { Injectable, Query } from '@nestjs/common';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from '../entities/job.entity';
import { Repository } from 'typeorm';
import { ResponseHandler } from 'src/utils/responseHandeller';
import { ServiceResponseDataType } from 'src/utils/apiResponse';
import { TypeSenseService } from 'src/typesense/typesense.service';
import { JobIdDto, SearchJobDto } from '../dto/common-job.dto';
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
        application_deadline: dbResult.application_deadline
          ? new Date(dbResult.application_deadline).toISOString()
          : '',
        posted_at: new Date(dbResult.posted_at).getTime(),
        updated_at: new Date(dbResult.updated_at).getTime(),
      });
      return this.responseHandler.successResponse('A new job is added');
    } catch (error) {
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error',
      );
    }
  }

  async findAllJobs(): Promise<ServiceResponseDataType> {
    try {
      const allJobs = await this.jobRepository.find();

      if (!allJobs.length) {
        return this.responseHandler.notFoundResponse(
          'No jobs available at the moment',
        );
      }

      return this.responseHandler.successResponse(
        'All job data fetched successfully',
        allJobs,
      );
    } catch (error) {
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error while fetching jobs',
      );
    }
  }

  async findOne(query: SearchJobDto): Promise<ServiceResponseDataType> {
    try {
      const searchResult = await this.typeSenseService
        .getClient()
        .collections('jobs')
        .documents()
        .search({
          q: query.q,
          query_by: 'title,company_name,description,location',
        });

      return this.responseHandler.successResponse(
        'Search completed',
        searchResult.hits?.map((hit) => hit.document),
      );
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error while fetching jobs',
      );
    }
  }

  async update(
    jobId: JobIdDto,
    updateJobDto: UpdateJobDto,
  ): Promise<ServiceResponseDataType> {
    try {
      const id = jobId.id;
      const existingJob = await this.jobRepository.findOne({ where: { id } });

      if (!existingJob) {
        return this.responseHandler.notFoundResponse(
          `Job with ID ${id} not found.`,
        );
      }

      const updatedJob = Object.assign(existingJob, updateJobDto);
      await this.jobRepository.save(updatedJob);

      const formattedJob = {
        id: updatedJob.id.toString(),
        title: updatedJob.title,
        company_name: updatedJob.company_name,
        location: updatedJob.location,
        description: updatedJob.description,
        employment_type: updatedJob.employment_type,
        hourly_pay: updatedJob.hourly_pay,
        urgent_hiring: updatedJob.urgent_hiring,
        remote_option: updatedJob.remote_option,
        experience_required: updatedJob.experience_required || '',
        education_level: updatedJob.education_level || '',
        application_deadline: updatedJob.application_deadline
          ? new Date(updatedJob.application_deadline).toISOString()
          : '',
        posted_at: new Date(updatedJob.posted_at).getTime(),
        updated_at: new Date(updatedJob.updated_at).getTime(),
      };

      await this.typeSenseService
        .getClient()
        .collections('jobs')
        .documents()
        .upsert(formattedJob);

      return this.responseHandler.successResponse(
        'Job updated successfully and synced with Typesense',
        updatedJob,
      );
    } catch (error) {
      console.error('Error updating job:', error);
      return this.responseHandler.unexpectedErrorResponse(
        'Failed to update job',
      );
    }
  }

  async remove(jobId: JobIdDto): Promise<ServiceResponseDataType> {
    try {
      const id = jobId.id;
      const job = await this.jobRepository.findOne({ where: { id } });

      if (!job) {
        return this.responseHandler.notFoundResponse(
          `Job with ID ${id} not found.`,
        );
      }

      await this.jobRepository.delete(id!);

      await this.typeSenseService
        .getClient()
        .collections('jobs')
        .documents(id!.toString())
        .delete();

      return this.responseHandler.successResponse(
        'Job deleted successfully',
        null,
      );
    } catch (error) {
      console.error('Error deleting job:', error);
      return this.responseHandler.unexpectedErrorResponse(
        'Failed to delete job',
      );
    }
  }
}
