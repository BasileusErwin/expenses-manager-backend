import { CurrencyEnum, MonthEnum, TransactionType } from '../enums';
import { dayHelper } from '../helpers';
import { body, query } from 'express-validator';

const createTransaction = [
  body('type', 'Please enter a type').notEmpty().trim(),
  body('amount', 'Please enter an amount').notEmpty().trim(),
  body('currency', 'Please enter a currency').isIn(Object.values(CurrencyEnum)),
  body('note', 'Please enter a note').optional().notEmpty().trim(),
  body('day', 'Please enter a day')
    .optional()
    .isNumeric({ no_symbols: true })
    .custom((value: number, { req }) => value > 0 && value <= dayHelper.getMaxDayByMonth(req.body.month))
    .trim(),
  body('month', 'Please enter a month').isIn(Object.values(MonthEnum)).trim(),
  body('year', 'Please enter a year')
    .isNumeric()
    .custom((value: number, _) => value.toString().length === 4)
    .trim(),
  body('categoryId', 'Please enter a categoryId or category')
    .custom((value: string, { req }) => !value && req.body.category)
    .trim(),
  body('category', 'Please enter a categoryId or category')
    .custom((value: string, { req }) => {
      if (value && !req.body.categoryId) {
        return true;
      }

      return false;
    })
    .isObject(),
  body('category.type', 'Please enter a category type, and make it equal to the transaction type.')
    .optional()
    .isIn(Object.values(TransactionType))
    .custom((value: TransactionType, { req }) => value === req.body.type),
  body('category.value', 'Please enter a category type, and make it equal to the transaction type.')
    .optional()
    .isString()
    .trim(),
  body('category.note', 'Please enter a category note').optional().isString().trim(),
];

const getTransaction = [
  query('month').optional().isIn(Object.values(MonthEnum)),
  query('day')
    .optional()
    .isNumeric()
    .custom((value, { req }) => {
      if (req.body?.month) {
        return value > 0 && value <= dayHelper.getMaxDayByMonth(req.body.month);
      }

      return value > 0 && value <= 31;
    }),
  query('year')
    .optional()
    .isNumeric()
    .custom((value, _) => value.toString().length === 4),
];

export const transactionValidation = {
  createTransaction,
  getTransaction,
};
