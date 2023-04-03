import { plainToInstance } from 'class-transformer';
import { CategoryModel, sequelize, TransactionModel } from '../models';
import { IncludeOptions, Transaction, WhereOptions } from 'sequelize';
import { CategoryDTO } from '../types/DTOs';
import { CreateCategoryRequest } from '../types/request/category';
import { CustomError } from '../lib';
import { ApiError } from 'enums/api_error.enum';

interface Opt {
  transaction?: Transaction;
  commit?: boolean;
}

async function deleteCategory(categoryId: string, deleteTransactions: boolean) {
  const transaction = await sequelize().transaction();
  try {
    if (deleteTransactions) {
      await TransactionModel.destroy({
        where: {
          categoryId,
        },
        transaction,
      });
    }

    const category = await getCategory(
      {
        where: {
          categoryId,
        },
      },
      [
        {
          model: TransactionModel,
        },
      ],
    );

    if (category.trasactions) {
      throw new CustomError(ApiError.Category.CANNOT_DELETE_CATEGORY_TRASACTIONS);
    }

    await CategoryModel.destroy({
      where: {
        categoryId,
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
  opt: Opt = null,
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
  if (!opt?.transaction) {
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
};
