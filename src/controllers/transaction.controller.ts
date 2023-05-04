import { ApiError, TransactionType } from '../enums';
import { transactionHelper, validationHelper } from '../helpers';
import { CustomError, CustomResponse, logger } from '../lib';
import { CategoryModel, TransactionModel } from '../models';
import { transactionService } from '../services';
import { TransactionDTO } from '../types/DTOs';
import { CreateTransactionRequest } from '../types/request/trsactions';
import { NextFunction, Request, Response } from 'express';
import { WhereOptions } from 'sequelize';
import { TransactionBalances } from '../types/response/transactions';
import { TransactionMetadata, TransactionsRedisMetadata } from '../types/redis_types';

async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const body = req.body;

    let newTransaction: CreateTransactionRequest | CreateTransactionRequest[];

    logger.debug({
      body,
    });

    const { transactions } = body;

    if (Array.isArray(transactions)) {
      const errors = transactionHelper.createTransactionValidation(transactions);

      if (errors.length) {
        throw new CustomError(ApiError.Server.PARAMS_REQUIRED, errors);
      }

      newTransaction = transactions.map(
        (value) =>
          new CreateTransactionRequest({
            ...value,
            userId: res.locals.userId,
          }),
      );
    } else {
      newTransaction = new CreateTransactionRequest({
        ...body,
        userId: res.locals.userId,
      });
    }

    const transaction = await transactionService.createTransactionByArray(newTransaction);

    res.send(new CustomResponse(true, transaction));
  } catch (err) {
    next(err);
  }
}

async function getTransactionById(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { transactionId } = req.params;
    const { userId } = res.locals;

    const transaction = await transactionService.getTrasaction(
      {
        transactionId,
        userId,
      },
      [
        {
          model: CategoryModel,
        },
      ],
    );

    if (!transaction) {
      throw new CustomError(ApiError.Transaction.TRANSACTION_NOT_EXIST);
    }

    res.send(new CustomResponse(true, transaction));
  } catch (err) {
    next(err);
  }
}

async function getAllTransactionsByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const where = transactionHelper.getQueryInGetTransaction(req, res);

    const transationsInRedis = await transactionService.getTransactionsInRedis(where.userId);

    if (transationsInRedis?.queryIsEqualToData(where)) {
      return res.send(new CustomResponse(true, transationsInRedis.object));
    }

    const transactions = await transactionService.getAllTrasactions(where as WhereOptions<TransactionModel>, [
      {
        model: CategoryModel,
      },
    ]);

    await transactionService.setTransactionsInRedis(transactions, where.userId, where as TransactionMetadata);

    res.send(new CustomResponse(true, transactions));
  } catch (err) {
    next(err);
  }
}

async function getTransactionBalance(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const where = transactionHelper.getQueryInGetTransaction(req, res);

    const balanceInRedis: TransactionsRedisMetadata<TransactionBalances> =
      await transactionService.getBalanceTransactionInRedis(where.userId);

    if (
      balanceInRedis &&
      new TransactionsRedisMetadata(balanceInRedis.object, balanceInRedis.metadata).queryIsEqualToData(where)
    ) {
      return res.send(new CustomResponse(true, balanceInRedis.object));
    }

    const transactions = await transactionService.getBalance(where.month);

    await transactionService.setBalanceTransactionInRedis(
      transactions,
      where.userId,
      where as TransactionMetadata,
    );

    res.send(new CustomResponse(true, transactions));
  } catch (err) {
    next(err);
  }
}

async function deleteTrasactions(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { transactionId } = req.params;

    await transactionService.deleteTransaction(transactionId);

    res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}

async function getMonthsAndYears(_req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = res.locals;

    const monthByYear = await transactionService.getMonthsAndYears(userId);

    res.send(new CustomResponse(true, monthByYear));
  } catch (err) {
    next(err);
  }
}

async function getTotalSavings(_req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = res.locals;

    const total = await transactionService.getAllTrasactions({
      userId,
      type: TransactionType.SAVING,
    });

    const totalSavings = total.reduce(
      (acc: number, transaction: TransactionDTO) => (acc += transaction.amount),
      0,
    );

    res.send(
      new CustomResponse(true, {
        totalSavings,
      }),
    );
  } catch (err) {
    next(err);
  }
}

async function setGoalIdInTrnasaction(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { userId } = res.locals;
    const { goalId } = req.body;
    const { transactionId } = req.params;

    await transactionService.setGoalIdInTransaction(transactionId, goalId, userId);

    res.send(new CustomResponse(true));
  } catch (err) {
    return next(err);
  }
}

export const transactionController = {
  createTransaction,
  getTransactionById,
  getAllTransactionsByUserId,
  getTransactionBalance,
  deleteTrasactions,
  getMonthsAndYears,
  getTotalSavings,
  setGoalIdInTrnasaction,
};
