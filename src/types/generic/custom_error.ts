import { StatusCodes } from "http-status-codes";

class ShowMessage {
  public EN: string;
  public ES: string;
}

class CustomError {
  public message: string;
  public showMessage: ShowMessage;
  public HTTPStatusCode: StatusCodes;
}

export { CustomError, ShowMessage };
