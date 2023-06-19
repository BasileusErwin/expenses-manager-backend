import { body, param } from 'express-validator';
import moment from 'moment';
import { dayHelper } from '../helpers';
import { CurrencyEnum, MonthEnum, TransactionType } from '../enums';

const createShoppingList = [
  body('items', 'Please enter a item').isArray(),
  body('name', 'Please enter a name').isString(),
];

const shoppingListIdInParam = [param('itemId').isUUID()];

const itemIdInParam = [param('listId').isUUID()];

const convertShoppingListItemToTransaction = [
  param('itemId').isUUID(),
  body('day', 'Please enter a day')
    .optional()
    .isInt({ min: 1, max: 31 })
    .custom((value: number, { req }) => value > 0 && value <= dayHelper.getMaxDayByMonth(req.body.month))
    .trim(),
  body('month', 'Please enter a month').isIn(Object.values(MonthEnum)).trim(),
  body('year', 'Please enter a year').isInt({ min: 2000, max: moment().year() }).trim(),
  body('note', 'Please enter a note').optional().isString(),
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
    .optional()
    .isIn(Object.values(TransactionType))
    .custom((value: TransactionType, { req }) => value === req.body.type),
  body('category.name', 'Please enter a name').if(body('category').exists()).isString().trim(),
  body('goalId', 'Please enter a goal id').optional().isUUID(),
];

export const shoppingListValidation = {
  createShoppingList,
  shoppingListIdInParam,
  itemIdInParam,
  convertShoppingListItemToTransaction,
};
