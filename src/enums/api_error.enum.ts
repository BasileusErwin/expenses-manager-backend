export namespace ApiError {
  export enum Auth {
    GENERIC = 1000,
    EXPIRED_TOKEN,
    BAD_AUTH,
    UNAUTHORIZED,
    BAD_EMAIL_FORMAT,
    NEED_BE_LOGGED_IN,
  }

  export enum Server {
    GENERIC = 2000,
    TOO_FEW_PARAMS,
    PARAMS_REQUIRED,
    NOT_FOUND,
  }

  export enum User {
    GENERIC = 3000,
    USER_DOES_NOT_EXIST,
    WRONG_PASSWORD,
    PASSWORD_TOO_SHORT,
    USER_ALREADY_EXISTS,
  }

  export enum Transaction {
    GENERIC = 4000,
    TRANSACTION_NOT_EXIST,
    TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE,
  }
}
