import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from '../Service/jobs.service';
import { CreateJobDto } from '../Dto/create-job.dto';
import { UpdateJobDto } from '../Dto/update-job.dto';
import { ControllerResponseDataType } from 'src/Utils/apiResponse';
import { ControllerResponse } from 'src/Utils/apiResponse';
import { JobIdDto, SearchJobDto } from '../Dto/common-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(
    @Body() createJobDto: CreateJobDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.jobsService.create(createJobDto);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Get()
  async findAll(): Promise<ControllerResponseDataType> {
    const result = await this.jobsService.findAllJobs();
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Get(':search')
  async findByQuery(
    @Query() searchJob: SearchJobDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.jobsService.findOne(searchJob);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Patch(':id')
  async update(
    @Param() id: JobIdDto,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<ControllerResponseDataType> {
    console.log(typeof id.id);
    const result = await this.jobsService.update(id, updateJobDto);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Delete(':id')
  async remove(@Param() id: JobIdDto): Promise<ControllerResponseDataType> {
    const result = await this.jobsService.remove(id);
    return ControllerResponse(result.status, result.message, result.details);
  }
}
