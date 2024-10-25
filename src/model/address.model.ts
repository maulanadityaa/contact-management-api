import { ApiProperty } from '@nestjs/swagger';

export class AddressRequest {
  @ApiProperty({example: 'Jl. Raya', description: 'Street'})
  street: string;

  @ApiProperty({example: 'Jakarta', description: 'City'})
  city: string;

  @ApiProperty({example: 'DKI Jakarta', description: 'Province'})
  province: string;

  @ApiProperty({example: 'Indonesia', description: 'Country'})
  country: string;

  @ApiProperty({example: '12345', description: 'Postal code'})
  postalCode: string;

  @ApiProperty({example: 'ValidUUIDv4', description: 'Contact ID'})
  contactId: string;
}

export class AddressUpdateRequest {
  @ApiProperty({example: 'ValidUUIDv4', description: 'Address ID'})
  id: string;

  @ApiProperty({example: 'Jl. Raya', description: 'Street (optional)'})
  street?: string;

  @ApiProperty({example: 'Jakarta', description: 'City (optional)'})
  city?: string;

  @ApiProperty({example: 'DKI Jakarta', description: 'Province (optional)'})
  province?: string;

  @ApiProperty({example: 'Indonesia', description: 'Country (optional)'})
  country?: string;

  @ApiProperty({example: '12345', description: 'Postal code (optional)'})
  postalCode?: string;

  @ApiProperty({example: 'ValidUUIDv4', description: 'Contact ID (optional)'})
  contactId?: string;
}

export class AddressGetRequest {
  contactId: string;
  addressId: string;
}

export class AddressResponse {
  id: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}
