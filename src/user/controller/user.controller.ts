import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ControllerResponseDataType } from 'src/utils/apiResponse';
import { ControllerResponse } from 'src/utils/apiResponse';
import { UUID } from 'crypto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.userService.create(createUserDto);
    return ControllerResponse(result.status, result.message, result.details);
  }
  @Get()
  async findAll() {
    const result = await this.userService.findAll();
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ControllerResponseDataType> {
    const result = await this.userService.findOne(id);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.userService.update(id, updateUserDto);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Delete(':id')
  async remove(@Param('id') id: UUID): Promise<ControllerResponseDataType> {
    const result = await this.userService.remove(id);
    return ControllerResponse(result.status, result.message, result.details);
  }
}
