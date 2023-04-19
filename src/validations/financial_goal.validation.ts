import { CurrencyEnum, FinancialGoalsType, MonthEnum } from '../enums';
import { body } from 'express-validator';

const createFinancialGoal = [
  body('type', `Please enter a type: ${Object.values(FinancialGoalsType).join('|')}`).isIn(
    Object.values(FinancialGoalsType),
  ),
  body('currency', `Please enter a currency: ${Object.values(CurrencyEnum).join('|')}`).isIn(
    Object.values(CurrencyEnum),
  ),
  body('note', 'Please enter a note').optional().isString().trim(),
  body('name', 'Please enter a name').isString().trim(),
  body('targetAmount', 'Please enter a target amount').isInt({ min: 0 }),
  body('month', `Please enter a month: ${Object.values(MonthEnum).join('|')}`).isIn(Object.values(MonthEnum)),
  body('year', 'Please enter a year').isInt({ min: new Date().getFullYear() }),
];

export const financialGoalValidation = {
  createFinancialGoal,
};
