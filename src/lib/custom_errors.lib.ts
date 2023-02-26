import { CustomError } from '../types/generic';
import { ApiError } from '../enums';

const customErrors: CustomError[] = [];

customErrors[ApiError.Auth.BAD_AUTH] = {
  message: 'Bad auth',
  showMessage: {
    EN: 'Incorrect email/password',
    ES: 'Email o contraseña incorrectos',
  },
  HTTPStatusCode: 400,
};

customErrors[ApiError.Auth.UNAUTHORIZED] = {
  message: 'Unauthorized',
  showMessage: {
    EN: 'Unauthorized',
    ES: 'No autorizado',
  },
  HTTPStatusCode: 401,
};

customErrors[ApiError.Auth.BAD_EMAIL_FORMAT] = {
  message: 'Bad email format',
  showMessage: {
    EN: 'Email is not valid',
    ES: 'Email no es válido',
  },
  HTTPStatusCode: 400,
};

customErrors[ApiError.Auth.EXPIRED_TOKEN] = {
  message: 'Expired token',
  showMessage: {
    EN: 'Your session has expired',
    ES: 'Su sesión ha expirado',
  },
  HTTPStatusCode: 401,
};

// Server
customErrors[ApiError.Server.TOO_FEW_PARAMS] = {
  message: 'Too few parameters',
  showMessage: {
    EN: 'Too few parameters',
    ES: 'Faltan parametros',
  },
  HTTPStatusCode: 400,
};

// User

customErrors[ApiError.User.USER_DOES_NOT_EXIST] = {
  message: 'User does not exist',
  showMessage: {
    EN: 'User does not exist',
    ES: 'El usuario no existe',
  },
  HTTPStatusCode: 404,
};

customErrors[ApiError.User.WRONG_PASSWORD] = {
  message: 'Wrong password',
  showMessage: {
    EN: 'Wrong password',
    ES: 'Contraseña incorrecta',
  },
  HTTPStatusCode: 400,
};

customErrors[ApiError.User.PASSWORD_TOO_SHORT] = {
  message: 'Password has to be at least 6 characters long',
  showMessage: {
    EN: 'Password has to be at least 6 characters long',
    ES: 'La contraseña debe tener un largo de al menos 6',
  },
  HTTPStatusCode: 400,
};

customErrors[ApiError.User.USER_ALREADY_EXISTS] = {
  message: 'User already exists',
  showMessage: {
    EN: 'User already exists',
    ES: 'El usuario ya existe',
  },
  HTTPStatusCode: 409,
};


export { customErrors };
