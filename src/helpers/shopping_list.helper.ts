import { ValidationError } from 'express-validator';
import { ShoppingListModel } from '../types/shopping_list';
import { CurrencyEnum } from '../enums';

type CustomValidationError = Omit<ValidationError, 'location' | 'nestedErrors'>;

function createShoppingListValidation(lists: ShoppingListModel[]): CustomValidationError[] {
  const error: CustomValidationError[] = [];

  for (const [index, list] of lists.entries()) {
    if (!list.name) {
      error.push({
        msg: 'Please enter a name',
        param: `shoppingList[${index}].type`,
        value: list.name,
      });
    }

    for (const [indexItem, item] of list.items.entries()) {
      if (!item.name && typeof item.name !== 'string') {
        error.push({
          msg: 'Please enter a name',
          param: `shoppingList[${index}].items[${indexItem}].name`,
          value: item.name,
        });
      }

      if (!item.price && typeof item.price !== 'number') {
        error.push({
          msg: 'Please enter a price',
          param: `shoppingList[${index}].items[${indexItem}].price`,
          value: item.price,
        });
      }

      if (!item.checked && typeof item.checked !== 'boolean') {
        error.push({
          msg: 'Please enter a checked only true or false',
          param: `shoppingList[${index}].items[${indexItem}].checked`,
          value: item.checked,
        });
      }

      if (!item.currency && !Object.values(CurrencyEnum).includes(item.currency)) {
        error.push({
          msg: `Please enter a currency: ${Object.values(CurrencyEnum).join('|')}`,
          param: `shoppingList[${index}].items[${indexItem}].currency`,
          value: item.currency,
        });
      }

      if (
        !item.exchangeRate &&
        Object.values(CurrencyEnum).shift().includes(item.currency) &&
        typeof item.exchangeRate !== 'number'
      ) {
        error.push({
          msg: 'Please enter an exchange rate',
          param: `shoppingList[${index}].items[${indexItem}].exchangeRate`,
          value: item.exchangeRate,
        });
      }

      if (!item.quantity && typeof item.quantity !== 'number') {
        error.push({
          msg: 'Please enter a quantity',
          param: `shoppingList[${index}].items[${indexItem}].quantity`,
          value: item.quantity,
        });
      }
    }
  }

  return error;
}

export const shoppingListHelper = {
  createShoppingListValidation,
};
