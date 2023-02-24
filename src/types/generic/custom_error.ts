class ShowMessage {
  public EN: string;
  public ES: string;
}

class CustomError {
  public message: string;
  public showMessage: ShowMessage;
  public HTTPStatusCode: number;
}

export { CustomError, ShowMessage };
