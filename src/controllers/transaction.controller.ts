import { ApiError, MonthEnum } from '../enums';
import { validationHelper } from '../helpers';
import { CustomError, CustomResponse, logger } from '../lib';
import { CategoryModel, TransactionModel } from '../models';
import { transactionService } from '../services';
import { TransactionDTO } from '../types/DTOs';
import { BodyRequest, CreateTransactionRequest } from '../types/request/trsactions';
import { NextFunction, Request, Response } from 'express';
import { WhereOptions } from 'sequelize';

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

    const transaction = await transactionService.createTransactionByType(newTransaction);

    res.send(new CustomResponse(true, transaction));
  } catch (err) {
    next(err);
  }
}

async function getTransactionById(req: Request, res: Response, next: NextFunction) {
  try {
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

    const { userId } = res.locals;
    const { day, month, year } = req.query;

    const where: WhereOptions<TransactionModel> = {
      userId,
    };

    if (month) {
      where.month = month as MonthEnum;
    }

    if (day) {
      where.day = +day;
    }

    if (year) {
      where.year = +year;
    }

    const transactions: TransactionDTO[] = await transactionService.getAllTrasactions(where, [
      {
        model: CategoryModel,
      },
    ]);

    if (!transactions) {
      throw new CustomError(ApiError.Transaction.TRANSACTION_NOT_EXIST);
    }

    res.send(new CustomResponse(true, transactions));
  } catch (err) {
    next(err);
  }
}

async function deleteTrasactions(req: Request, res: Response, next: NextFunction) {
  try {
    const { transactionId } = req.params;

    await transactionService.deleteTransaction(transactionId);

    res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}

export const transactionController = {
  createTransaction,
  getTransactionById,
  getAllTransactionsByUserId,
  deleteTrasactions,
};
