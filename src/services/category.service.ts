import { plainToInstance } from 'class-transformer';
import { CategoryModel, sequelize, TransactionModel } from '../models';
import { IncludeOptions, Transaction, WhereOptions } from 'sequelize';
import { CategoryDTO } from '../types/DTOs';
import { CreateCategoryRequest } from '../types/request/category';
import { CustomError, logger } from '../lib';
import { ApiError } from 'enums/api_error.enum';

interface Opt {
  transaction?: Transaction;
  commit?: boolean;
}

async function getAllCategories(userId: string): Promise<CategoryDTO[]> {
  const categories = await CategoryModel.findAll({
    where: {
      userId,
    },
  });

  return plainToInstance(CategoryDTO, categories);
}

async function deleteCategory(categoryId: string, userId: string, deleteTransactions: boolean) {
  const transaction = await sequelize().transaction();
  try {
    const category = await CategoryModel.findOne({
      where: {
        userId,
        categoryId,
      },
      include: [
        {
          model: TransactionModel,
        },
      ],
      transaction,
    });

    if (!category) {
      throw new CustomError(ApiError.Category.CATEGORY_NOT_EXIST);
    }

    logger.debug({
      category,
      deleteTransactions,
    });

    if (category?.trasactions.length !== 0 && !deleteTransactions) {
      throw new CustomError(ApiError.Category.CANNOT_DELETE_CATEGORY_TRASACTIONS);
    }

    if (deleteTransactions) {
      await TransactionModel.destroy({
        where: {
          categoryId,
          userId,
        },
        transaction,
      });
    } else {
      await TransactionModel.update(
        {
          categoryId: null,
        },
        {
          where: {
            categoryId,
            userId,
          },
          transaction,
        },
      );
    }

    await CategoryModel.destroy({
      where: {
        categoryId,
        userId,
      },
      transaction,
    });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

async function getCategory(
  where: WhereOptions<CategoryModel>,
  include: IncludeOptions[] = [],
  opt: Opt = {
    transaction: null,
    commit: true,
  },
): Promise<CategoryDTO> {
  if (!opt?.transaction) {
    opt.transaction = await sequelize().transaction();
  }

  try {
    const category = await CategoryModel.findOne({
      where,
      include,
      transaction: opt.transaction,
    });

    if (opt?.commit) {
      opt.transaction.commit();
    }

    return plainToInstance(CategoryDTO, category);
  } catch (err) {
    if (opt?.commit) {
      opt.transaction.rollback();
    }

    throw err;
  }
}

async function createCategory(newCategory: CreateCategoryRequest, opt: Opt = null): Promise<CategoryDTO> {
  if (!opt.transaction) {
    opt.transaction = await sequelize().transaction();
  }

  try {
    const category = await CategoryModel.create(newCategory, {
      transaction: opt.transaction,
    });

    if (opt?.commit) {
      opt.transaction.commit();
    }

    return plainToInstance(CategoryDTO, category);
  } catch (err) {
    if (opt?.commit) {
      opt.transaction.rollback();
    }

    throw err;
  }
}

export const categoryService = {
  getCategory,
  createCategory,
  deleteCategory,
  getAllCategories,
};
