import { CategoryModel, sequelize, TransactionModel } from '../models';
import { CreateTransactionRequest } from '../types/request/trsactions';
import { CategoryDTO, TransactionDTO } from '../types/DTOs';
import { CategoryService } from './category.service';
import { CustomError, logger } from '../lib';
import { ApiError } from '../enums';
import { plainToInstance } from 'class-transformer';
import { IncludeOptions, WhereOptions } from 'sequelize';

export class TransactionService {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public async createTransaction(newTransaction: CreateTransactionRequest): Promise<TransactionDTO> {
    const transaction = await sequelize().transaction();
    try {
      let category: CategoryDTO;
      if (newTransaction.categoryId) {
        category = await this.categoryService.getCategory({
          categoryId: newTransaction.categoryId,
          type: newTransaction.type,
        });

        if (category.type !== newTransaction.type) {
          throw new CustomError(ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE);
        }
      } else {
        if (newTransaction.category.type !== newTransaction.type) {
          throw new CustomError(ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE);
        }

        category = await this.categoryService.createCategory(newTransaction.category, {
          transaction,
          commit: false,
        });
      }

      newTransaction.category = null;

      newTransaction.categoryId = category.categoryId;

      const transactionCreated: TransactionModel = await TransactionModel.create(
        {
          type: newTransaction.type,
          amount: newTransaction.amount,
          date: newTransaction.date,
          currency: newTransaction.currency,
          note: newTransaction.note,
          userId: newTransaction.userId,
          categoryId: newTransaction.categoryId,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      return plainToInstance(TransactionDTO, transactionCreated);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  public async getAllTrasactions(
    where: WhereOptions<TransactionModel>,
    include: IncludeOptions[] = [],
  ): Promise<TransactionDTO[]> {
    const trasactions = await TransactionModel.findAll({
      where,
      include,
    });

    logger.debug({
      trasactions,
    });

    return plainToInstance(TransactionDTO, trasactions);
  }

  public async getTrasaction(
    where: WhereOptions<TransactionModel>,
    include: IncludeOptions[] = [],
  ): Promise<TransactionDTO> {
    const trasaction = await TransactionModel.findOne({
      where,
      include,
    });

    return plainToInstance(TransactionDTO, trasaction);
  }
}
