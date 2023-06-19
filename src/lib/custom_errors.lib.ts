import { CustomError } from '../types/generic';
import { ApiError, FinancialGoalsType, TransactionType } from '../enums';
import { StatusCodes } from 'http-status-codes';

const customErrors: CustomError[] = [];

customErrors[ApiError.Auth.BAD_AUTH] = {
  message: 'Bad auth',
  showMessage: {
    EN: 'Incorrect email/password',
    ES: 'Email o contraseña incorrectos',
  },
  HTTPStatusCode: StatusCodes.BAD_REQUEST,
};

customErrors[ApiError.Auth.UNAUTHORIZED] = {
  message: 'Unauthorized',
  showMessage: {
    EN: 'Unauthorized',
    ES: 'No autorizado',
  },
  HTTPStatusCode: StatusCodes.UNAUTHORIZED,
};

customErrors[ApiError.Auth.BAD_EMAIL_FORMAT] = {
  message: 'Bad email format',
  showMessage: {
    EN: 'Email is not valid',
    ES: 'Email no es válido',
  },
  HTTPStatusCode: StatusCodes.BAD_REQUEST,
};

customErrors[ApiError.Auth.EXPIRED_TOKEN] = {
  message: 'Expired token',
  showMessage: {
    EN: 'Your session has expired',
    ES: 'Su sesión ha expirado',
  },
  HTTPStatusCode: StatusCodes.UNAUTHORIZED,
};

customErrors[ApiError.Auth.NEED_BE_LOGGED_IN] = {
  message: 'You need to be logged in',
  showMessage: {
    EN: 'You need to be logged in',
    ES: 'Debe estar conectado',
  },
  HTTPStatusCode: StatusCodes.UNAUTHORIZED,
};

// Server
customErrors[ApiError.Server.TOO_FEW_PARAMS] = {
  message: 'Too few parameters',
  showMessage: {
    EN: 'Too few parameters',
    ES: 'Faltan parametros',
  },
  HTTPStatusCode: StatusCodes.BAD_REQUEST,
};

customErrors[ApiError.Server.NOT_FOUND] = {
  message: 'Not found',
  showMessage: {
    EN: 'Not found',
    ES: 'Recurso no encontrado',
  },
  HTTPStatusCode: StatusCodes.NOT_FOUND,
};

customErrors[ApiError.Server.PARAMS_REQUIRED] = {
  message: 'Some body parameters are missing or are incorrect',
  showMessage: {
    EN: 'Some body parameters are missing or are incorrect',
    ES: 'Faltan o son incorrectos algunos parametros de la solicitud',
  },
  HTTPStatusCode: StatusCodes.BAD_REQUEST,
};

// User

customErrors[ApiError.User.USER_DOES_NOT_EXIST] = {
  message: 'User does not exist',
  showMessage: {
    EN: 'User does not exist',
    ES: 'El usuario no existe',
  },
  HTTPStatusCode: StatusCodes.NOT_FOUND,
};

customErrors[ApiError.User.WRONG_PASSWORD] = {
  message: 'Wrong password',
  showMessage: {
    EN: 'Wrong password',
    ES: 'Contraseña incorrecta',
  },
  HTTPStatusCode: StatusCodes.UNAUTHORIZED,
};

customErrors[ApiError.User.PASSWORD_TOO_SHORT] = {
  message: 'Password has to be at least 6 characters long',
  showMessage: {
    EN: 'Password has to be at least 6 characters long',
    ES: 'La contraseña debe tener un largo de al menos 6',
  },
  HTTPStatusCode: StatusCodes.UNAUTHORIZED,
};

customErrors[ApiError.User.USER_ALREADY_EXISTS] = {
  message: 'User already exists',
  showMessage: {
    EN: 'User already exists',
    ES: 'El usuario ya existe',
  },
  HTTPStatusCode: StatusCodes.CONFLICT,
};

// Transaction
customErrors[ApiError.Transaction.TRANSACTION_AND_GOAL_NOT_SAME_TYPE] = {
  message: 'Transaction and goal are not of the same type.',
  showMessage: {
    EN: `Transaction and goal are not of the same type. (${FinancialGoalsType.SPEND_LESS} == ${TransactionType.INSTALLMENTS}|${TransactionType.EXPENSE} || ${FinancialGoalsType.SAVING} == ${TransactionType.SAVING}`,
    ES: `La transacción y el objetivo no son del mismo tipo. (${FinancialGoalsType.SPEND_LESS} == ${TransactionType.INSTALLMENTS}|${TransactionType.EXPENSE} || ${FinancialGoalsType.SAVING} == ${TransactionType.SAVING}`,
  },
  HTTPStatusCode: StatusCodes.CONFLICT,
};

customErrors[ApiError.Transaction.TRANSACTION_AND_GOAL_NOT_SAME_CURENCY] = {
  message: 'Transaction and goal are not of the same currency.',
  showMessage: {
    EN: 'Transaction and goal are not of the same currency.',
    ES: 'La transacción y la objetivo no tienen la misma moneda',
  },
  HTTPStatusCode: StatusCodes.CONFLICT,
};

customErrors[ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE] = {
  message: 'Transaction and category are not of the same type.',
  showMessage: {
    EN: 'Transaction and category are not of the same type.',
    ES: 'La transacción y la categoría no son del mismo tipo.',
  },
  HTTPStatusCode: StatusCodes.CONFLICT,
};

customErrors[ApiError.Transaction.TRANSACTION_NOT_EXIST] = {
  message: 'Transaction not exist',
  showMessage: {
    EN: 'Transaction not exist',
    ES: 'La transacción no existe',
  },
  HTTPStatusCode: StatusCodes.NOT_FOUND,
};

// category
customErrors[ApiError.Category.CATEGORY_NOT_EXIST] = {
  message: 'Category not exist',
  showMessage: {
    EN: 'Category not exist',
    ES: 'La categoria no existe',
  },
  HTTPStatusCode: StatusCodes.NOT_FOUND,
};

customErrors[ApiError.Category.CANNOT_DELETE_CATEGORY_TRASACTIONS] = {
  message: 'Cannot delete a category with trasactions',
  showMessage: {
    EN: 'Cannot delete a category with trasactions, try with the query `?deleteTransactions=true` to delete all transactions.',
    ES: 'No se puede eliminar una categoría con transacciones, pruebe con la query `?deleteTransactions=true` para eliminar todas las transacciones',
  },
  HTTPStatusCode: StatusCodes.UNAUTHORIZED,
};

customErrors[ApiError.FinancialGoal.FINANCIAL_GOAL_NOT_EXIST] = {
  message: 'Financial goal not exist.',
  showMessage: {
    EN: 'Financial goal not exist.',
    ES: 'El objetivo financiero no existe',
  },
  HTTPStatusCode: StatusCodes.NOT_FOUND,
};

customErrors[ApiError.ShoppingList.SHOPPING_LIST_ITEM_NOT_EXIST] = {
  message: 'The item on the shopping list does not exist.',
  showMessage: {
    EN: 'The item on the shopping list does not exist.',
    ES: 'El artículo de la lista de la compra no existe.',
  },
  HTTPStatusCode: StatusCodes.NOT_FOUND,
};

customErrors[ApiError.ShoppingList.SHOPPING_LIST_NOT_EXIST] = {
  message: 'The shopping list does not exist.',
  showMessage: {
    EN: 'The shopping list does not exist.',
    ES: 'La lista de la compra no existe.',
  },
  HTTPStatusCode: StatusCodes.NOT_FOUND,
};

export { customErrors };
