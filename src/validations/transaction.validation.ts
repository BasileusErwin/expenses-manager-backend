import { CurrencyEnum, MonthEnum, TransactionType } from '../enums';
import { dayHelper } from '../helpers';
import { body, query } from 'express-validator';

const createTransaction = [
  body('transactions', 'Please enter a transactions').if(body('type').not().exists()).isArray(),
  body('type', 'Please enter a type').if(body('transactions').not().exists()).notEmpty().trim(),
  body('amount', 'Please enter an amount').if(body('transactions').not().exists()).notEmpty().trim(),
  body('currency', 'Please enter a currency')
    .if(body('transactions').not().exists())
    .isIn(Object.values(CurrencyEnum)),
  body('note', 'Please enter a note').if(body('transactions').not().exists()).optional().notEmpty().trim(),
  body('day', 'Please enter a day')
    .if(body('transactions').not().exists())
    .optional()
    .isInt({ min: 1, max: 31 })
    .custom((value: number, { req }) => value > 0 && value <= dayHelper.getMaxDayByMonth(req.body.month))
    .trim(),
  body('month', 'Please enter a month')
    .if(body('transactions').not().exists())
    .isIn(Object.values(MonthEnum))
    .trim(),
  body('year', 'Please enter a year').if(body('transactions').not().exists()).isInt({ min: 2000 }).trim(),
  body('exchangeRate', 'Please enter a exchangeRate')
    .if(body('currency').custom((value) => value === CurrencyEnum.USD || value === CurrencyEnum.EUR))
    .isNumeric()
    .trim(),
  body('categoryId', 'Please enter a categoryId or category')
    .if(body('transactions').not().exists())
    .if(body('category').not().exists())
    .isUUID(),
  body('category', 'Please enter a categoryId or category')
    .if(body('transactions').not().exists())
    .if(body('categoryId').not().exists())
    .isObject(),
  body('category.type', 'Please enter a category type, and make it equal to the transaction type.')
    .if(body('category').exists())
    .isIn(Object.values(TransactionType))
    .custom((value: TransactionType, { req }) => value === req.body.type),
  body('category.name', 'Please enter a name').if(body('category').exists()).isString().trim(),
];

const getTransaction = [
  query('month').optional().isIn(Object.values(MonthEnum)),
  query('day')
    .optional()
    .isInt({ min: 1, max: 31 })
    .custom((value, { req }) => {
      if (req.body?.month) {
        return value > 0 && value <= dayHelper.getMaxDayByMonth(req.body.month);
      }
    }),
  query('year').optional().isInt({ min: 2000 }),
];

export const transactionValidation = {
  createTransaction,
  getTransaction,
};
