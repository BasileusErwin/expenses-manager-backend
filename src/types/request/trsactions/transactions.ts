import { CurrencyEnum, TransactionType } from '../../../enums';
import { CreateCategoryRequest } from '../category';

export interface BodyRequest {
  type: TransactionType;
  amount: number;
  date: Date;
  currency: CurrencyEnum;
  note: string;
  userId: string;
  categoryId?: string;
  category?: CreateCategoryRequest;
}

export class CreateTransactionRequest {
  readonly type: TransactionType;
  readonly amount: number;
  readonly date: Date;
  readonly currency: CurrencyEnum;
  readonly note: string;
  readonly userId: string;
  public categoryId?: string;
  public category?: CreateCategoryRequest;

  constructor({ type, amount, date, currency, note, userId, categoryId, category }: BodyRequest) {
    this.note = note;
    this.type = type;
    this.amount = amount;
    this.currency = currency;
    this.userId = userId;
    this.date = date;
    if (!categoryId) {
      this.category = category;
    } else {
      this.categoryId = categoryId;
    }
  }
}
