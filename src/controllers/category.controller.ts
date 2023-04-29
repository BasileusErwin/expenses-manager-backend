import { ApiError } from 'enums/api_error.enum';
import { NextFunction, Request, Response } from 'express';
import { validationHelper } from '../helpers';
import { CustomResponse, CustomError } from '../lib';
import { categoryService } from '../services';

async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { userId } = res.locals;
    const body = req.body;

    const category = await categoryService.createCategory(
      {
        ...body,
        userId,
      },
      {
        transaction: null,
        commit: true,
      },
    );

    res.send(new CustomResponse(true, category));
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { categoryId } = req.params;
    const { deleteTransactions } = req.query;
    const { userId } = res.locals;

    await categoryService.deleteCategory(categoryId, userId, Boolean(deleteTransactions));

    res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}

async function getCategoryById(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { categoryId } = req.params;

    const category = await categoryService.getCategory(
      {
        categoryId,
        userId: res.locals.userId,
      },
      [],
      {
        transaction: null,
        commit: true,
      },
    );

    if (!category) {
      throw new CustomError(ApiError.Category.CATEGORY_NOT_EXIST);
    }

    res.send(new CustomResponse(true, category));
  } catch (err) {
    next(err);
  }
}

async function getAllCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.getAllCategories(res.locals.userId);

    res.send(new CustomResponse(true, category));
  } catch (err) {
    next(err);
  }
}

export const categoryController = {
  createCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
