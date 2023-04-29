import { CurrencyEnum, MonthEnum, TransactionType } from '../../src/enums';
import { CreateTransactionRequest, BodyRequest } from '../../src/types/request/trsactions';

const transaction: CreateTransactionRequest = new CreateTransactionRequest({
  amount: 0,
  day: 1,
  note: 'Note Example',
  currency: CurrencyEnum.UYU,
  userId: '',
  month: MonthEnum.JANUARY,
  type: TransactionType.INCOME,
  year: 2023,
});

function buildTransaction(attributes: Partial<BodyRequest>): CreateTransactionRequest {
  const build = Object.assign({}, transaction);

  const keys = Object.keys(attributes);

  keys.forEach((key) => {
    build[key] = attributes[key];
  });

  return build;
}

export const transactionFactory = {
  transaction,
  buildTransaction,
};
