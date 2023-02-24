import { ShowMessage } from '../types/generic';
import { customErrors } from '.';

export class CustomResponse<T extends object> {
  public data: T;
  public result: boolean;
  public message: string;
  public showMessage: ShowMessage;

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

      return;
    }
  }
}
