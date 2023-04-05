import { CurrencyEnum, MonthEnum, TransactionType } from '../enums';
import { dayHelper } from '../helpers';
import { body, query } from 'express-validator';
import { logger } from 'lib/logger.lib';

const createTransaction = [
  body('type', 'Please enter a type').notEmpty().trim(),
  body('amount', 'Please enter an amount').notEmpty().trim(),
  body('currency', 'Please enter a currency').isIn(Object.values(CurrencyEnum)),
  body('note', 'Please enter a note').optional().notEmpty().trim(),
  body('day', 'Please enter a day')
    .optional()
    .isInt({ min: 1, max: 31 })
    .custom((value: number, { req }) => value > 0 && value <= dayHelper.getMaxDayByMonth(req.body.month))
    .trim(),
  body('month', 'Please enter a month').isIn(Object.values(MonthEnum)).trim(),
  body('year', 'Please enter a year').isInt({ min: 2000 }).trim(),
  body('categoryId', 'Please enter a categoryId or category').if(body('category').not().exists()).isUUID(),
  body('category', 'Please enter a categoryId or category').if(body('categoryId').not().exists()).isObject(),
  body('category.type', 'Please enter a category type, and make it equal to the transaction type.')
    .if(body('category').exists())
    .isIn(Object.values(TransactionType))
    .custom((value: TransactionType, { req }) => value === req.body.type),
  body('category.value', 'Please enter a category type, and make it equal to the transaction type.')
    .if(body('category').exists())
    .isString()
    .trim(),
  body('category.note', 'Please enter a category note')
    .optional()
    .if(body('category').exists())
    .isString()
    .trim(),
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
