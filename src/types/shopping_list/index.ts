import { CurrencyEnum } from "enums/currency.enum";

interface ShoppingListItemModel {
  _id: string;
  name: string;
  quantity: number;
  price: number
  exchangeRate: number
  currency: CurrencyEnum
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

export { ShoppingListItemModel, ShoppingListModel };
