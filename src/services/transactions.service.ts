import { IncludeOptions, Transaction, WhereOptions } from 'sequelize';
import { CategoryModel, FinancialGoalModel, sequelize, TransactionModel } from '../models';
import { CreateTransactionRequest } from '../types/request/trsactions';
import { Balances, TransactionBalances } from '../types/response/transactions';
import { CategoryDTO, TransactionDTO } from '../types/DTOs';
import { categoryService, financialGoalService } from '.';
import { CustomError, logger } from '../lib';
import { ApiError, CurrencyEnum, FinancialGoalsType, MonthEnum, TransactionType } from '../enums';
import { plainToInstance } from 'class-transformer';
import { redisClient } from '../redis';
import { TransactionsRedisMetadata, TransactionMetadata } from '../types/redis_types';

async function deleteTransaction(transactionId: string) {
  const transaction = await getTrasaction(
    {
      transactionId,
    },
    [
      {
        model: FinancialGoalModel,
      },
    ],
  );

  if (!transaction) {
    throw new CustomError(ApiError.Transaction.TRANSACTION_NOT_EXIST);
  }

  if (transaction?.goalId) {
    await financialGoalService.updateFinancialGoal(
      {
        currentAmount: transaction.financialGoal.currentAmount - transaction.amount,
      },
      {
        goalId: transaction.goalId,
      },
    );

    await updateTransaction(
      {
        goalId: null,
      },
      {
        transactionId,
      },
    );
  }

  await TransactionModel.destroy({
    where: {
      transactionId,
    },
  });
}

async function createTransactionByArray(
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

      logger.debug({
        category,
      });

      if (!category) {
        throw new CustomError(ApiError.Category.CATEGORY_NOT_EXIST);
      }

      if (category.type !== newTransaction.type) {
        throw new CustomError(ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE);
      }
    } else {
      if (newTransaction.category?.type && newTransaction.category.type !== newTransaction.type) {
        throw new CustomError(ApiError.Transaction.TRANSACTION_AND_CATEGORY_NOT_SAME_TYPE);
      }

      const type = newTransaction.category?.type ? newTransaction.category?.type : newTransaction.type;

      category = await categoryService.createCategory(
        {
          ...newTransaction.category,
          type,
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

async function getBalance(month: MonthEnum): Promise<TransactionBalances> {
  const transactions = await getAllTrasactions(
    month
      ? {
          month,
        }
      : {},
    [],
  );

  return calculateBalances(transactions);
}

function calculateBalance(transaction: TransactionDTO, balances: Balances) {
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
}

function calculateBalances(transactions: TransactionDTO[]): TransactionBalances {
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

  transactions.forEach((transaction) => {
    switch (transaction.type) {
      case TransactionType.EXPENSE:
      case TransactionType.INSTALLMENTS:
        calculateBalance(transaction, expenses);
        break;
      case TransactionType.INCOME:
        calculateBalance(transaction, incomes);
        break;
      case TransactionType.SAVING:
        calculateBalance(transaction, savings);
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

async function updateTransaction<T extends Object>(
  newTransaction: T,
  where: WhereOptions<TransactionModel>,
): Promise<TransactionDTO> {
  const transactions = await getAllTrasactions(where, []);

  if (!transactions) {
    throw new CustomError(ApiError.Transaction.TRANSACTION_NOT_EXIST);
  }

  const updated = await TransactionModel.update(newTransaction, {
    where,
  });

  return plainToInstance(TransactionDTO, updated[0][1].get());
}

async function setGoalIdInTransaction(transactionId: string, goalId: string, userId: string) {
  const transaction = await getTrasaction(
    {
      transactionId,
      goalId: null,
    },
    [],
  );

  if (!transaction) {
    throw new CustomError(ApiError.Transaction.TRANSACTION_NOT_EXIST);
  }

  const financialGoal = await financialGoalService.getFinancialGoal(
    {
      goalId,
      userId,
    },
    [],
  );

  if (!financialGoal) {
    throw new CustomError(ApiError.FinancialGoal.FINANCIAL_GOAL_NOT_EXIST);
  }

  if (financialGoal.currency !== transaction.currency) {
    throw new CustomError(ApiError.Transaction.TRANSACTION_AND_GOAL_NOT_SAME_CURENCY);
  }

  if (
    (financialGoal.type === FinancialGoalsType.SPEND_LESS &&
      ![TransactionType.EXPENSE, TransactionType.INSTALLMENTS].includes(transaction.type)) ||
    (financialGoal.type === FinancialGoalsType.SAVING && ![TransactionType.SAVING].includes(transaction.type))
  ) {
    throw new CustomError(ApiError.Transaction.TRANSACTION_AND_GOAL_NOT_SAME_TYPE);
  }

  await TransactionModel.update(
    {
      goalId,
    },
    {
      where: {
        userId,
        transactionId,
      },
    },
  );

  const currentAmount = financialGoal.currentAmount + transaction.amount;

  await financialGoalService.updateFinancialGoal(
    {
      currentAmount,
    },
    {
      goalId,
    },
  );
}

async function getTransactionsInRedis(userId: string): Promise<TransactionsRedisMetadata<TransactionDTO[]>> {
  const transactions: string = await redisClient.get(`transactions:${userId}`);

  return JSON.parse(transactions);
}

async function setTransactionsInRedis(
  transactions: TransactionDTO[],
  userId: string,
  metadata: TransactionMetadata,
) {
  await redisClient.set(
    `transactions:${userId}`,
    JSON.stringify(new TransactionsRedisMetadata(transactions, metadata)),
    {
      EX: 30 * 60 * 1000, // 30 min
    },
  );
}

async function getBalanceTransactionInRedis(
  userId: string,
): Promise<TransactionsRedisMetadata<TransactionBalances>> {
  const balance: string = await redisClient.get(`balances:${userId}`);

  return JSON.parse(balance);
}

async function setBalanceTransactionInRedis(
  transactions: TransactionBalances,
  userId: string,
  metadata: TransactionMetadata,
) {
  await redisClient.set(
    `balances:${userId}`,
    JSON.stringify(new TransactionsRedisMetadata(transactions, metadata)),
    {
      EX: 30 * 60 * 1000, // 30 min
    },
  );
}

async function deleteTransactionsInRedis(userId: string) {
  await redisClient.del(`transactions:${userId}`)
}

async function deleteBalanceTransactionInRedis(userId: string) {
  await redisClient.del(`balances:${userId}`)
}

export const transactionService = {
  deleteTransaction,
  createTransaction,
  getTrasaction,
  getAllTrasactions,
  createTransactionByArray,
  getMonthsAndYears,
  calculateBalance,
  calculateBalances,
  updateTransaction,
  getBalance,
  setGoalIdInTransaction,
  getTransactionsInRedis,
  setTransactionsInRedis,
  getBalanceTransactionInRedis,
  setBalanceTransactionInRedis,
  deleteTransactionsInRedis,
  deleteBalanceTransactionInRedis,
};
