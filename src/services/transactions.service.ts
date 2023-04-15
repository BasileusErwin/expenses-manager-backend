import { CategoryModel, sequelize, TransactionModel } from '../models';
import { CreateTransactionRequest } from '../types/request/trsactions';
import { CategoryDTO, TransactionDTO } from '../types/DTOs';
import { categoryService } from '.';
import { CustomError, logger } from '../lib';
import { ApiError, CurrencyEnum, MonthEnum, TransactionType } from '../enums';
import { plainToInstance } from 'class-transformer';
import { IncludeOptions, Transaction, WhereOptions } from 'sequelize';
import { Balances, TransactionBalances } from 'src/types/response/transactions';

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
      const transactionCreated: TransactionDTO[] = [];

      for (const transactionData of newTransaction) {
        const data = await createTransaction(transactionData, transaction, false);

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
          userId: newTransaction.userId,
        },
        [],
        { transaction },
      );

      if (!category) {
        throw new CustomError(ApiError.Category.CATEGORY_NOT_EXIST);
      }

      if (category.type !== newTransaction.type) {
        throw new CustomError(ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE);
      }
    } else {
      if (newTransaction.category.type !== newTransaction.type) {
        throw new CustomError(ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE);
      }

      category = await categoryService.createCategory(
        {
          ...newTransaction.category,
          userId: newTransaction.userId,
        },
        {
          transaction,
          commit: false,
        },
      );
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
        exchangeRate: newTransaction?.exchangeRate,
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

async function calculateBalances(month: MonthEnum): Promise<TransactionBalances> {
  const transactions = await getAllTrasactions(
    month
      ? {
          month,
        }
      : {},
    [],
  );

  const expenses: Balances = {
    total: 0,
    eur: 0,
    usd: 0,
    uyu: 0,
  };

  const incomes: Balances = {
    total: 0,
    eur: 0,
    usd: 0,
    uyu: 0,
  };

  const savings: Balances = {
    total: 0,
    eur: 0,
    usd: 0,
    uyu: 0,
  };

  const getBalance = (transaction: TransactionDTO, balances: Balances) => {
    switch (transaction.currency) {
      case CurrencyEnum.UYU:
        balances.uyu += transaction.amount;
        balances.total += transaction.amount;
        break;
      case CurrencyEnum.USD:
        balances.usd += transaction.amount;
        balances.total += transaction.amount * transaction.exchangeRate;
        break;
      case CurrencyEnum.EUR:
        balances.eur += transaction.amount;
        balances.total += transaction.amount * transaction.exchangeRate;
        break;
    }

    balances.total = +balances.total.toFixed(2);
    balances.eur = +balances.eur.toFixed(2);
    balances.usd = +balances.usd.toFixed(2);
    balances.uyu = +balances.uyu.toFixed(2);
  };

  transactions.forEach((transaction) => {
    switch (transaction.type) {
      case TransactionType.EXPENSE:
      case TransactionType.INSTALLMENTS:
        getBalance(transaction, expenses);
        break;
      case TransactionType.INCOME:
        getBalance(transaction, incomes);
        break;
      case TransactionType.SAVING:
        getBalance(transaction, savings);
        break;
    }
  });

  return {
    expenses,
    incomes,
    savings,
  };
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

type MonthByYear = { [key: string]: string[] };

async function getMonthsAndYears(userId: string): Promise<MonthByYear> {
  const transactions = await TransactionModel.findAll({
    where: {
      userId,
    },
    attributes: ['month', 'year'],
  });

  const monthByYear: MonthByYear = {};

  for (const value of transactions) {
    if (!monthByYear.hasOwnProperty(value.year)) {
      monthByYear[value.year] = [];
    }

    if (!monthByYear[value.year].includes(value.month)) {
      monthByYear[value.year].push(value.month);
    }

    monthByYear[value.year].sort(
      (a: MonthEnum, b: MonthEnum) =>
        Object.values(MonthEnum).indexOf(a) - Object.values(MonthEnum).indexOf(b),
    );
  }

  return monthByYear;
}

export const transactionService = {
  deleteTransaction,
  createTransaction,
  getTrasaction,
  getAllTrasactions,
  createTransactionByType,
  getMonthsAndYears,
  calculateBalances,
};
