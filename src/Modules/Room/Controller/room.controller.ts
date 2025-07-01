/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RoomDto, SearchRoomDto } from '../Dto/room.dto';
import { RoomService } from '../Service/room.service';
import {
  ControllerResponse,
  ControllerResponseDataType,
} from 'src/Utils/apiResponse';
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
}
