import { ApiError } from 'enums/api_error.enum';
import { NextFunction, Request, Response } from 'express';
import { CustomResponse, CustomError } from '../lib';
import { categoryService } from '../services';

async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId } = req.params;
    const { deleteTransactions } = req.query;

    await categoryService.deleteCategory(categoryId, Boolean(deleteTransactions));

    res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}

async function getCategoryById(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.getCategory({
      categoryId,
      userId: res.locals.userId,
    });

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
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
