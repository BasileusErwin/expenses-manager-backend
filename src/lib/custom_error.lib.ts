import { customErrors } from '.';
import { StatusCodes } from 'http-status-codes';

export class CustomError<T extends object> extends Error {
  public errorCode: number;
  public data: T;
  public message: string;
  public statusCode: StatusCodes;

  constructor(errorCode: number, data?: T) {
    super(customErrors[errorCode].message);
    this.data = data;
    this.message = customErrors[errorCode].message;
    this.statusCode = customErrors[errorCode].HTTPStatusCode;
    this.errorCode = errorCode;
  }
}
