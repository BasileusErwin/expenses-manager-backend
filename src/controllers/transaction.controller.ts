import { NextFunction, Request, Response } from 'express';
import { validationHelper } from '../helpers';
import { CustomResponse } from '../lib';
import { BodyRequest, CreateTransactionRequest } from '../types/request/trsactions';
import { TransactionService } from 'services/transactions.service';

const transactionService: TransactionService = new TransactionService();

export class TransactionController {
  public async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const body: BodyRequest = req.body;
      const newTransaction = new CreateTransactionRequest(body);

      const transaction = await transactionService.createTransaction(newTransaction);

      res.send(new CustomResponse(true, transaction));
    } catch (err) {
      next(err);
    }
  }

  public async getTransactionById(req: Request, res: Response, next: NextFunction) {}

  public async getAllTransactionsByUserId(req: Request, res: Response, next: NextFunction) {}
}
