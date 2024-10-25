export class AddressRequest {
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  contactId: string;
}

export class AddressUpdateRequest {
  id: string;
  street?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
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
