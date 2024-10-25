import { ApiProperty } from '@nestjs/swagger';

export class ContactRequest {
  @ApiProperty({example: 'John', description: 'First name'})
  firstName: string;

  @ApiProperty({example: 'Doe', description: 'Last name'})
  lastName: string;

  @ApiProperty({example: 'johndoe@mail.com', description: 'Email'})
  email: string;

  @ApiProperty({example: '0812345678', description: 'Phone number'})
  phone: string;
}

export class ContactUpdateRequest {
  @ApiProperty({example: 'ValidUUIDv4', description: 'Contact ID'})
  id: string;

  @ApiProperty({example: 'John', description: 'First name (optional)'})
  firstName?: string;

  @ApiProperty({example: 'Doe', description: 'Last name (optional)'})
  lastName?: string;

  @ApiProperty({example: 'johndoe@mail.com', description: 'Email (optional)'})
  email?: string;

  @ApiProperty({example: '0812345678', description: 'Phone number (optional)'})
  phone?: string;
}

export class ContactSearchRequest {
  @ApiProperty({example: 'John Doe', description: 'First name or Last name'})
  name?: string;

  @ApiProperty({example: 'johndoe@mail.com', description: 'Email'})
  email?: string;

  @ApiProperty({example: '0812345678', description: 'Phone number'})
  phone?: string;

  @ApiProperty({example: 1, description: 'Page number (optional) - default 1'})
  page?: number;

  @ApiProperty({example: 10, description: 'Page size (optional) - default 10'})
  size?: number;
}

export class ContactResponse {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
