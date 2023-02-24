export namespace ApiError {
  export enum Auth {
    EXPIRED_TOKEN = 1000,
    BAD_AUTH,
    UNAUTHORIZED,
    USER_ALREADY_EXISTS,
    BAD_EMAIL_FORMAT,
  }

  export enum Server {
    TOO_FEW_PARAMS = 2000,
    PARAMS_REQUIRED,
  }

  export enum User {
    USER_DOES_NOT_EXIST = 3000,
    WRONG_PASSWORD,
    PASSWORD_TOO_SHORT,
  }
}
