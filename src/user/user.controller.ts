import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CommonResponse } from '../model/web.model';
import {
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
  UserUpdateRequest,
} from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(
    @Body() request: UserRegisterRequest,
  ): Promise<CommonResponse<UserResponse>> {
    const result = await this.userService.register(request);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: UserLoginRequest,
  ): Promise<CommonResponse<UserResponse>> {
    const result = await this.userService.login(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @Get('current')
  @HttpCode(HttpStatus.OK)
  async get(@Auth() user: User): Promise<CommonResponse<UserResponse>> {
    const result = await this.userService.get(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'User found',
      data: result,
    };
  }

  @Patch('current')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Body() request: UserUpdateRequest,
  ): Promise<CommonResponse<UserResponse>> {
    const result = await this.userService.update(user, request);

    return {
      statusCode: HttpStatus.OK,
      message: 'User updated',
      data: result,
    };
  }

  @Delete('current')
  @HttpCode(HttpStatus.OK)
  async logout(@Auth() user: User): Promise<CommonResponse<boolean>> {
    await this.userService.logout(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged out',
      data: true,
    };
  }
}
