import { CustomError, logger } from '../lib';
import { ShoppingList } from '../mongo';
import { ShoppingListItemModel, ShoppingListModel } from '../types/shopping_list';
import { ApiError, MonthEnum, TransactionType } from '../enums';
import { TransactionDTO } from '../types/DTOs';
import { transactionService } from './transactions.service';
import { BodyRequest } from '../types/request/trsactions';
import { CategoryModel } from '../models';
import moment from 'moment';

async function createShoppingList(list: ShoppingListModel): Promise<ShoppingListModel> {
  const shoppingList: ShoppingListModel = await ShoppingList.create(list);

  return shoppingList;
}

async function getAllShoppingList(userId: string): Promise<ShoppingListModel[]> {
  return await ShoppingList.find({
    userId,
  });
}

async function getShoppingList(listId: string, userid: string): Promise<ShoppingListModel> {
  return await ShoppingList.findById({
    _id: listId,
    userid,
  });
}

async function getShoppingListItemByListId(listId: string, userId: string): Promise<ShoppingListItemModel[]> {
  const list = await ShoppingList.findOne({
    _id: listId,
    userId,
  });

  return list.items;
}

async function checkShoppingListItem(listId: string, itemId: string, userId: string): Promise<void> {
  const shoppingList = await ShoppingList.findOne({
    _id: listId,
    'items._id': itemId,
    userId,
  });

  if (!shoppingList) {
    throw new CustomError(ApiError.ShoppingList.SHOPPING_LIST_ITEM_NOT_EXIST);
  }

  const item = shoppingList.items.find((item: ShoppingListItemModel) => item._id === itemId);

  item.checked = !item.checked;
  item.updatedAt = new Date();

  shoppingList.items = shoppingList.items.map((shoppingListItem: ShoppingListItemModel) =>
    shoppingListItem._id === itemId ? item : shoppingListItem,
  );

  shoppingList.updatedAt = new Date();

  await shoppingList.save();
}

async function deleteShoppingListItem(itemId: string, userId: string): Promise<void> {
  const shoppingList = await ShoppingList.findOne({
    'items._id': itemId,
    userId,
  });

  if (!shoppingList) {
    throw new CustomError(ApiError.ShoppingList.SHOPPING_LIST_ITEM_NOT_EXIST);
  }

  const shoppingListItem = await getShoppingListItemByListId(shoppingList._id, userId);

  const index = shoppingListItem.findIndex((item) => item._id === itemId);

  if (!shoppingListItem || index === -1) {
    throw new CustomError(ApiError.ShoppingList.SHOPPING_LIST_ITEM_NOT_EXIST);
  }

  shoppingList.items.splice(index, 1);
  shoppingList.updatedAt = new Date();

  shoppingList.save();
}

async function deleteShoppingList(listId: string, userId: string): Promise<void> {
  const shoppingList = await ShoppingList.findOne({
    _id: listId,
    userId,
  });

  if (!shoppingList) {
    throw new CustomError(ApiError.ShoppingList.SHOPPING_LIST_NOT_EXIST);
  }

  await shoppingList.deleteOne();
}

async function getShoppingListItemById(itemId: string, userId: string): Promise<ShoppingListItemModel> {
  const shoppingList = await ShoppingList.findOne({
    'items._id': itemId,
    userId,
  });

  if (!shoppingList) {
    throw new CustomError(ApiError.ShoppingList.SHOPPING_LIST_NOT_EXIST);
  }

  return shoppingList.items.find((item) => item._id === itemId);
}

interface ExtraData {
  day: number;
  month: MonthEnum;
  year: number;
  note: string;
  categoryId?: string;
  category?: CategoryModel;
  goalId?: string;
}

async function converShoppingListItemToTransaction(
  itemId: string,
  userId: string,
  extraData: ExtraData,
): Promise<TransactionDTO> {
  const shoppingList = await ShoppingList.findOne({
    'items.itemId': itemId,
    userId,
  });

  if (!shoppingList) {
    throw new CustomError(ApiError.ShoppingList.SHOPPING_LIST_ITEM_NOT_EXIST);
  }

  const shoppingListItem = await getShoppingListItemById(itemId, userId);

  const createTransactionRequest: BodyRequest = {
    userId,
    amount: shoppingListItem.price,
    currency: shoppingListItem.currency,
    day: extraData.day ? extraData.day : null,
    month: extraData.month
      ? extraData.month
      : Object.values(MonthEnum)[moment(shoppingListItem.createdAt).month()],
    type: TransactionType.EXPENSE,
    year: extraData.year ? extraData.year : moment().year(),
    note: extraData.note ? extraData.note : shoppingListItem.name,
    categoryId: extraData.categoryId,
    category: extraData.category,
  };

  return await transactionService.createTransaction(createTransactionRequest);
}

export const shoppingListService = {
  createShoppingList,
  getAllShoppingList,
  getShoppingList,
  getShoppingListItemByListId,
  checkShoppingListItem,
  deleteShoppingList,
  deleteShoppingListItem,
};
