import { CurrencyEnum, TransactionType } from '../enums';
import { body } from 'express-validator';

const createTransaction = [
  body('type', 'Please enter a type').notEmpty().trim(),
  body('amount', 'Please enter an amount').notEmpty().trim(),
  body('currency', 'Please enter a currency').isIn(Object.values(CurrencyEnum)),
  body('note', 'Please enter a note').optional().notEmpty().trim(),
  body('date', 'Please enter a date').notEmpty().isISO8601().toDate().trim(),
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

export const transactionValidation = {
  createTransaction,
};
