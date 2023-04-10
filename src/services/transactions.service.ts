import { CategoryModel, sequelize, TransactionModel } from "../models";
import { CreateTransactionRequest } from "../types/request/trsactions";
import { CategoryDTO, TransactionDTO } from "../types/DTOs";
import { categoryService } from ".";
import { CustomError, logger } from "../lib";
import { ApiError } from "../enums";
import { plainToInstance } from "class-transformer";
import { IncludeOptions, Transaction, WhereOptions } from "sequelize";

async function deleteTransaction(transactionId: string) {
  await TransactionModel.destroy({
    where: {
      transactionId,
    },
  });
}

async function createTransactionByType(
  newTransaction: CreateTransactionRequest | CreateTransactionRequest[],
): Promise<TransactionDTO | TransactionDTO[]> {
  const transaction = await sequelize().transaction();
  try {
    if (Array.isArray(newTransaction)) {
      let transactionCreated: TransactionDTO[] = [];

      for (const transactionData of newTransaction) {
        const data = await createTransaction(
          transactionData,
          transaction,
          false,
        );

        transactionCreated.push(data);
      }

      await transaction.commit();

      return transactionCreated;
    } else {
      return await createTransaction(newTransaction);
    }
  } catch (err) {
    transaction.rollback();
    throw err;
  }
}

async function createTransaction(
  newTransaction: CreateTransactionRequest,
  transaction: Transaction = undefined,
  commit: boolean = true,
): Promise<TransactionDTO> {
  if (!transaction) {
    transaction = await sequelize().transaction();
  }

  try {
    let category: CategoryDTO;
    if (newTransaction.categoryId) {
      category = await categoryService.getCategory(
        {
          categoryId: newTransaction.categoryId,
          type: newTransaction.type,
        },
        [],
        { transaction },
      );

      if (category.type !== newTransaction.type) {
        throw new CustomError(
          ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE,
        );
      }
    } else {
      if (newTransaction.category.type !== newTransaction.type) {
        throw new CustomError(
          ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE,
        );
      }

      category = await categoryService.createCategory(newTransaction.category, {
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
        day: newTransaction.day,
        month: newTransaction.month,
        year: newTransaction.year,
        currency: newTransaction.currency,
        note: newTransaction.note,
        userId: newTransaction.userId,
        categoryId: newTransaction.categoryId,
      },
      {
        include: [
          {
            model: CategoryModel,
          },
        ],
        transaction,
      },
    );

    if (commit) {
      await transaction.commit();
    }

    return plainToInstance(TransactionDTO, transactionCreated);
  } catch (err) {
    if (commit) {
      await transaction.rollback();
    }
    throw err;
  }
}

async function getAllTrasactions(
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

async function getTrasaction(
  where: WhereOptions<TransactionModel>,
  include: IncludeOptions[] = [],
): Promise<TransactionDTO> {
  const trasaction = await TransactionModel.findOne({
    where,
    include,
  });

  return plainToInstance(TransactionDTO, trasaction);
}

export const transactionService = {
  deleteTransaction,
  createTransaction,
  getTrasaction,
  getAllTrasactions,
  createTransactionByType,
};
