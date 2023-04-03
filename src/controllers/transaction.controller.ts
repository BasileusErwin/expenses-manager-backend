import { validationHelper } from '../helpers';
import { CustomError, CustomResponse } from '../lib';
import { transactionService } from '../services';
import { BodyRequest, CreateTransactionRequest } from '../types/request/trsactions';
import { NextFunction, Request, Response } from 'express';
import { TransactionDTO } from '../types/DTOs';
import { CategoryModel } from '../models';
import { ApiError } from '../enums';

async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const body: BodyRequest = req.body;
    const newTransaction = new CreateTransactionRequest({
      ...body,
      userId: res.locals.userId,
    });

    const transaction = await transactionService.createTransaction(newTransaction);

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

async function getAllTransactionsByUserId(_req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = res.locals;

    const transactions: TransactionDTO[] = await transactionService.getAllTrasactions(
      {
        userId,
      },
      [
        {
          model: CategoryModel,
        },
      ],
    );

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