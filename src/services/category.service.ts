import { plainToInstance } from 'class-transformer';
import { CategoryModel, sequelize } from '../models';
import { Transaction } from 'sequelize/types';
import { CategoryDTO } from 'src/types/DTOs';
import { CreateCategoryRequest } from 'src/types/request/category';

interface Opt {
  transaction?: Transaction;
  commit?: boolean;
}

export class CategoryService {
  public async getCategory(where: any, include: any[] = [], opt: Opt = null): Promise<CategoryDTO> {
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
        transaction: opt.transaction
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
