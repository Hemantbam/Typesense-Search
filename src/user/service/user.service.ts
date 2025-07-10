import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseHandler } from 'src/utils/responseHandeller';
import { ServiceResponseDataType } from 'src/utils/apiResponse';
import { UUID } from 'crypto';
@Injectable()
export class UserService {
  constructor(
    private readonly responseHandler: ResponseHandler,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<ServiceResponseDataType> {
    try {
      const checkValidUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (checkValidUser && checkValidUser.verified === true) {
        return this.responseHandler.conflictResponse('User already exists');
      }

      if (checkValidUser && checkValidUser.verified === false) {
        return this.responseHandler.conflictResponse(
          'Please verify the email that is already registered',
        );
      }

      const user = this.userRepository.create(createUserDto);
      const result = await this.userRepository.save(user);

      if (!result) {
        return this.responseHandler.badRequestResponse('Enter valid user data');
      }

      return this.responseHandler.successResponse(
        'User created successfully',
        result,
      );
    } catch (error) {
      console.error('User creation error:', error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error',
      );
    }
  }

  async findAll(): Promise<ServiceResponseDataType> {
    try {
      const result = await this.userRepository.find();
      if (!result) {
        return this.responseHandler.notFoundResponse('No user details found');
      }
      return this.responseHandler.successResponse(
        'User details fetched successfully',
        result,
      );
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error',
      );
    }
  }

  async findOne(id: string): Promise<ServiceResponseDataType> {
    try {
      const userDetails = await this.userRepository.findOne({
        where: { id: id },
      });
      if (!userDetails) {
        return this.responseHandler.notFoundResponse('No user details found');
      }

      return this.responseHandler.successResponse(
        'User details fetched successfully ',
        userDetails,
      );
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error',
      );
    }
  }

  async update(
    id: UUID,
    updateUserDto: UpdateUserDto,
  ): Promise<ServiceResponseDataType> {
    try {
      const userDetails = await this.userRepository.findOne({
        where: { id: id },
      });
      if (!userDetails) {
        return this.responseHandler.notFoundResponse('No user details found');
      }
      const updateUser = Object.assign(userDetails, updateUserDto);
      const result = await this.userRepository.save(updateUser);
      if (!result) {
        return this.responseHandler.badRequestResponse(
          'Error while updating user data',
        );
      }
      return this.responseHandler.successResponse(
        'Successfully updated user data',
        result,
      );
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal Server Error',
      );
    }
  }

  async remove(id: UUID): Promise<ServiceResponseDataType> {
    try {
      const userData = await this.userRepository.findOne({ where: { id } });
      if (!userData) {
        return this.responseHandler.notFoundResponse(
          'No user found with the given id',
        );
      }
      const deleteUser = await this.userRepository.delete(id);
      if (!deleteUser) {
        return this.responseHandler.badRequestResponse(
          'Error while removing user data',
        );
      }
      return this.responseHandler.successResponse(
        'User details deleted successfully',
      );
    } catch (error) {
      console.log(error);
      return this.responseHandler.unexpectedErrorResponse(
        'Internal server error',
      );
    }
  }
}
