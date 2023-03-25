import { check } from 'express-validator';

const createTransaction = [
  check('type', 'Please enter a type').notEmpty().trim(),
  check('amount', 'Please enter an amount').notEmpty().trim(),
  check('currency', 'Please enter a currency').isEmail().withMessage().normalizeEmail(),
  check('note', 'Please enter a note').notEmpty().trim(),
  check('categoryId', 'Please enter a categoryId or category').optional().notEmpty().trim(),
  check('category', 'Please enter a categoryId or category').optional().custom(() => {
  })
];

export const transactionValidation = {
  createTransaction,
};
