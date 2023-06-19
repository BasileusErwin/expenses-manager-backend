import { Request, Response, NextFunction } from 'express';
import { shoppingListHelper, validationHelper } from '../helpers';
import { CustomError, CustomResponse, logger } from '../lib';
import { ApiError } from '../enums';
import { shoppingListService } from '../services';
import { ShoppingListModel } from '../types/shopping_list';

async function createShoppingList(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);
    logger.debug(req.body);

    const { shippingLists } = req.body;

    if (Array.isArray(shippingLists)) {
      const errors = shoppingListHelper.createShoppingListValidation(shippingLists);

      if (errors.length) {
        throw new CustomError(ApiError.Server.PARAMS_REQUIRED, errors);
      }
    } else {
      const body: ShoppingListModel = req.body;
      body.userId = res.locals.userId;

      const list = await shoppingListService.createShoppingList(body);

      return res.send(new CustomResponse(true, list));
    }
  } catch (err) {
    next(err);
  }
}

async function getAllShoppingList(_req: Request, res: Response, next: NextFunction) {
  try {
    const list = await shoppingListService.getAllShoppingList(res.locals.userId);

    return res.send(new CustomResponse(true, list));
  } catch (err) {
    next(err);
  }
}

async function getShoppingList(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await shoppingListService.getShoppingList(req.params.listId, res.locals.userId);

    return res.send(new CustomResponse(true, list));
  } catch (err) {
    next(err);
  }
}

async function getShoppingListItemByListId(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await shoppingListService.getShoppingListItemByListId(req.params.listId, res.locals.userId);

    return res.send(new CustomResponse(true, list));
  } catch (err) {
    next(err);
  }
}

async function checkShoppingListItem(req: Request, res: Response, next: NextFunction) {
  try {
    await shoppingListService.checkShoppingListItem(req.params.listId, req.params.itemId, res.locals.userId);

    return res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}

async function deleteShoppingList(req: Request, res: Response, next: NextFunction) {
  try {
    await shoppingListService.deleteShoppingList(req.params.listId, res.locals.userId);

    return res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}

async function deleteShoppingListItem(req: Request, res: Response, next: NextFunction) {
  try {
    await shoppingListService.deleteShoppingListItem(req.params.itemId, res.locals.userId);

    return res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}

async function convertShoppingListItemToTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const transaction = await shoppingListService.converShoppingListItemToTransaction(
      req.params.itemId,
      res.locals.userId,
      req.body,
    );

    return res.send(new CustomResponse(true, transaction));
  } catch (err) {
    next(err);
  }
}

export const shoppingListController = {
  createShoppingList,
  getAllShoppingList,
  getShoppingList,
  getShoppingListItemByListId,
  checkShoppingListItem,
  deleteShoppingList,
  deleteShoppingListItem,
  convertShoppingListItemToTransaction,
};
