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

customErrors[ApiError.Auth.NEED_BE_LOGGED_IN] = {
  message: 'You need to be logged in',
  showMessage: {
    EN: 'You need to be logged in',
    ES: 'Debe estar conectado',
  },
  HTTPStatusCode: 400,
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

customErrors[ApiError.Server.NOT_FOUND] = {
  message: 'Not found',
  showMessage: {
    EN: 'Not found',
    ES: 'Recurso no encontrado',
  },
  HTTPStatusCode: 404,
};

customErrors[ApiError.Server.PARAMS_REQUIRED] = {
  message: 'Some body parameters are missing or are incorrect',
  showMessage: {
    EN: 'Some body parameters are missing or are incorrect',
    ES: 'Faltan o son incorrectos algunos parametros de la solicitud',
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

// Transaction
customErrors[ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE] = {
  message: 'Transaction and category are not of the same type.',
  showMessage: {
    EN: 'Transaction and category are not of the same type.',
    ES: 'La transacción y la categoría no son del mismo tipo.',
  },
  HTTPStatusCode: 409,
};

customErrors[ApiError.Transaction.TRANSACTION_NOT_EXIST] = {
  message: 'Transaction not exist',
  showMessage: {
    EN: 'Transaction not exist',
    ES: 'La transacción no existe',
  },
  HTTPStatusCode: 404,
};

// category
customErrors[ApiError.Category.CATEGORY_NOT_EXIST] = {
  message: 'Category not exist',
  showMessage: {
    EN: 'Category not exist',
    ES: 'La transacción no existe',
  },
  HTTPStatusCode: 404,
};

customErrors[ApiError.Category.CANNOT_DELETE_CATEGORY_TRASACTIONS] = {
  message: 'Cannot delete a category with trasactions',
  showMessage: {
    EN: 'Cannot delete a category with trasactions, try with the query `?deleteTransactions=true` to delete all transactions.',
    ES: 'No se puede eliminar una categoría con transacciones, pruebe con la query `?deleteTransactions=true` para eliminar todas las transacciones',
  },
  HTTPStatusCode: 400,
};

export { customErrors };
