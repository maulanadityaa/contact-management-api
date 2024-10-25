import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterRequest {
  @ApiProperty({example: 'test_username', description: 'Username'})
  username: string;

  @ApiProperty({example: 'test_password', description: 'Password'})
  password: string;

  @ApiProperty({example: 'test_name', description: 'Name'})
  name: string;
}

export class UserLoginRequest {
  @ApiProperty({example: 'test_username', description: 'Username'})
  username: string;

  @ApiProperty({example: 'test_password', description: 'Password'})
  password: string;
}

export class UserUpdateRequest {
  @ApiProperty({example: 'test_name', description: 'Name (optional)'})
  name?: string;

  @ApiProperty({example: 'test_password', description: 'Password (optional)'})
  password?: string;
}

export class UserResponse {
  username: string;
  name: string;
  token?: string;
}
