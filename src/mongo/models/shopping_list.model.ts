import { Schema, Model, model } from 'mongoose';
import * as uuid from 'uuid';
import { CurrencyEnum } from '../../enums';
import { mongoUtil } from '../../utils';
import { ShoppingListModel } from '../../types/shopping_list';

const ShoppingListSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  items: [
    {
      _id: {
        type: String,
        default: uuid.v4,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      exchangeRate: {
        type: Number,
      },
      currency: {
        type: String,
        enum: Object.values(CurrencyEnum),
        required: true,
      },
      checked: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mongoUtil.applySoftDelete(ShoppingListSchema);

const ShoppingList: Model<ShoppingListModel> = model<ShoppingListModel>('ShoppingList', ShoppingListSchema);

export { ShoppingList };
