import { CurrencyEnum, MonthEnum, TransactionType } from '../enums';
import { CreateTransactionRequest } from '../types/request/trsactions';
import { ValidationError } from 'express-validator';
import { dayHelper } from './day.helper';
import { Request, Response } from 'express';

function createTransactionValidation(
  transactions: CreateTransactionRequest[],
): Omit<ValidationError, 'location' | 'nestedErrors'>[] {
  const error: Omit<ValidationError, 'location' | 'nestedErrors'>[] = [];

  for (const [index, transaction] of transactions.entries()) {
    if (!Object.values(TransactionType).includes(transaction.type)) {
      error.push({
        msg: `Please enter a type: ${Object.values(TransactionType).join('|')}`,
        param: `transactions[${index}].type`,
        value: transaction.type,
      });
    }

    if (!transaction.amount || typeof transaction.amount !== 'number') {
      error.push({
        msg: 'Please enter a amount',
        param: `transactions[${index}].amount`,
        value: transaction.amount,
      });
    }

    if (!Object.values(CurrencyEnum).includes(transaction.currency)) {
      error.push({
        msg: 'Please enter a currency',
        param: `transactions[${index}].currency`,
        value: transaction.currency,
      });
    } else {
      if (
        (transaction.currency === CurrencyEnum.USD || transaction.currency === CurrencyEnum.EUR) &&
        !transaction.exchangeRate
      ) {
        error.push({
          msg: 'Please enter a exchange rate',
          param: `transactions[${index}].exchangeRate`,
          value: transaction.exchangeRate,
        });
      }
    }

    if (!Object.values(MonthEnum).includes(transaction.month)) {
      error.push({
        msg: `Please enter a month: ${Object.values(MonthEnum).join(' | ')}`,
        param: `transactions[${index}].month`,
        value: transaction.month,
      });
    }

    if (
      !(
        transaction.day &&
        transaction.day > 0 &&
        transaction.day <= dayHelper.getMaxDayByMonth(transaction.month)
      )
    ) {
      error.push({
        msg: `Please enter a day for ${transaction.month}`,
        param: `transactions[${index}].day`,
        value: transaction.day,
      });
    }

    if (!transaction.year || transaction.year < 2000) {
      error.push({
        msg: 'Please enter a year > 2000',
        param: `transactions[${index}].year`,
        value: transaction.year,
      });
    }

    if (transaction.categoryId && transaction.category) {
      error.push({
        msg: 'Please only enter a category or a category id',
        param: `transactions[${index}].category | transaction[${index}].categoryId`,
        value: null,
      });
    } else if (!(transaction.categoryId || transaction.category)) {
      error.push({
        msg: 'Please enter a category or a category id',
        param: `transactions[${index}].category | transaction[${index}].categoryId`,
        value: null,
      });
    } else {
      if (!transaction.categoryId || transaction.category) {
        if (
          transaction.category?.type &&
          !Object.values(TransactionType).includes(transaction.category?.type) &&
          transaction.category?.type !== transaction.type
        ) {
          error.push({
            msg: 'Transaction and category are not of the same type.',
            param: `transactions[${index}].category.type`,
            value: null,
          });
        }

        if (!transaction.category.name) {
          error.push({
            msg: 'Please enter a category name.',
            param: `transactions[${index}].category.name`,
            value: transaction.category.name,
          });
        }
      }
    }
  }

  return error;
}

interface TransactionQuery {
  userId: string;
  type?: TransactionType;
  day?: number;
  month?: MonthEnum;
  year?: number;
}

function getQueryInGetTransaction(req: Request, { locals }: Response): TransactionQuery {
  const where: TransactionQuery = {
    userId: locals.userId,
  };

  if (req.query.type) {
    where.type = TransactionType[req.query.type as string];
  }

  if (req.query.month) {
    where.month = MonthEnum[req.query.month as string];
  }

  if (req.query.day) {
    where.day = +req.query.day;
  }

  if (req.query.year) {
    where.year = +req.query.year;
  }

  return where;
}

export const transactionHelper = {
  createTransactionValidation,
  getQueryInGetTransaction,
};
