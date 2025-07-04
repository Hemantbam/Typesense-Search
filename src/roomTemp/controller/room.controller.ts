/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  RoomDto,
  RoomIdDto,
  SearchRoomDto,
  UpdateRoomDto,
} from '../dto/room.dto';

import { RoomService } from '../service/room.service';
import {
  ControllerResponse,
  ControllerResponseDataType,
} from 'src/utilsTemp/apiResponse';
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async addRoom(
    @Body() roomDetailsDto: RoomDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.roomService.addRoom(roomDetailsDto);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Get()
  async getRoomsWithSearch(
    @Query() searchRoomDto: SearchRoomDto,
  ): Promise<ControllerResponseDataType> {
    console.log('object', searchRoomDto.q);
    const result = await this.roomService.getRoom(searchRoomDto.q ?? '');
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Delete()
  async deleteRoomDetails(
    @Query() roomId: RoomIdDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.roomService.deleteRoom(roomId);
    return ControllerResponse(result.status, result.message, result.details);
  }

  @Patch()
  async updateDetails(
    @Query() roomId: RoomIdDto,
    @Body() roomDto: UpdateRoomDto,
  ): Promise<ControllerResponseDataType> {
    const result = await this.roomService.updateRoomDetails(roomId, roomDto);
    return ControllerResponse(result.status, result.message, result.details);
  }
}
