export namespace ApiError {
  export enum Auth {
    GENERIC = 1000,
    EXPIRED_TOKEN,
    BAD_AUTH,
    UNAUTHORIZED,
    BAD_EMAIL_FORMAT,
  }

  export enum Server {
    GENERIC = 2000,
    TOO_FEW_PARAMS,
    PARAMS_REQUIRED,
  }

  export enum User {
    GENERIC = 3000,
    USER_DOES_NOT_EXIST,
    WRONG_PASSWORD,
    PASSWORD_TOO_SHORT,
    USER_ALREADY_EXISTS,
  }
}
