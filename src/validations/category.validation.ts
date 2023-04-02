import { TransactionType } from 'enums/transaction_type.enum';
import { check } from 'express-validator';

const createCategory = [
  check('type', 'Please enter a type').notEmpty().trim().isIn(Object.values(TransactionType)),
  check('value', 'Please enter a value').isEmail().normalizeEmail(),
  check('note', 'Please enter a note').notEmpty().trim(),
];

export const categoryValidation = {
  createCategory,
};
