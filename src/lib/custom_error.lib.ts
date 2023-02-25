import { customErrors, logger } from '.';

export class CustomError<T extends object> extends Error {
  public errorCode: number;
  public data: T;
  public message: string;
  public statusCode: number;

  constructor(errorCode: number, data?: T) {
    super(customErrors[errorCode].message);
    this.data = data;
    this.message = customErrors[errorCode].message;
    this.statusCode = customErrors[errorCode].HTTPStatusCode;
  }
}
