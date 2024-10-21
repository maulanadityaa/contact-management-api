export class CommonResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: string;
}
