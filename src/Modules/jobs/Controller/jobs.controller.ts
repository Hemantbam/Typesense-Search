import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobsService } from '../Service/jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { ControllerResponseDataType } from 'src/Utils/apiResponse';
import { ControllerResponse } from 'src/Utils/apiResponse';
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
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
