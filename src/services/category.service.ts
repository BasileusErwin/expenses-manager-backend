import { plainToInstance } from 'class-transformer';
import { CategoryModel, sequelize } from '../models';
import { IncludeOptions, Transaction, WhereOptions } from 'sequelize';
import { CategoryDTO } from '../types/DTOs';
import { CreateCategoryRequest } from '../types/request/category';

interface Opt {
  transaction?: Transaction;
  commit?: boolean;
}

export class CategoryService {
  public async getCategory(
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

  public async createCategory(newCategory: CreateCategoryRequest, opt: Opt = null): Promise<CategoryDTO> {
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
}
