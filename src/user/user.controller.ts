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
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('/api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered' })
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
  @ApiOperation({ summary: 'Login to the system' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
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
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found' })
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
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated' })
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
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged out' })
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
