export class ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class ContactUpdateRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export class ContactSearchRequest {
  name?: string;
  email?: string;
  phone?: string;
  page?: number;
  size?: number;
}

export class ContactResponse {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
