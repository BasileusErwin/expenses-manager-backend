import { body, param } from 'express-validator';
import { CurrencyEnum } from '../enums';

interface ShoppingListItemModel {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  exchangeRate: number;
  currency: CurrencyEnum;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ShoppingListModel {
  _id: string;
  userId: string;
  name: string;
  items: ShoppingListItemModel[];
  createdAt: Date;
  updatedAt: Date;
}

const createShoppingList = [
  body('shoppingList', 'Please enter a shopping list').if(body('type').not().exists()).isArray(),
  body('items', 'Please enter a item').if(body('type').not().exists()).isArray(),
  body('name', 'Please enter a name').if(body('type').not().exists()),
];

const shoppingListIdInParam = [param('itemId').isUUID()];

const itemIdInParam = [param('listId').isUUID()];

export const shoppingListValidation = {
  createShoppingList,
  shoppingListIdInParam,
  itemIdInParam,
};
