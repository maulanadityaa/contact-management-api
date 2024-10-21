import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonResponse } from '../model/web.model';
import {
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
} from '../model/user.model';

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

  @Post('/login')
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
}
