import { ShowMessage } from '../types/generic';
import { customErrors } from '.';

export class CustomResponse<T extends object | string> {
  readonly data: T;
  readonly result: boolean;
  readonly message: string;
  readonly showMessage: ShowMessage;
  readonly errorCode: number;

  constructor(result: boolean, data?: T, errorCode?: number) {
    this.data = data;
    this.result = result;

    if (result) {
      this.message = null;
      this.showMessage = null;

      return;
    }

    if (errorCode) {
      this.message = customErrors[errorCode].message;
      this.showMessage = customErrors[errorCode].showMessage;
      this.errorCode = errorCode;

      return;
    }
  }
}
