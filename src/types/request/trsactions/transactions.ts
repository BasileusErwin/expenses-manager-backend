import { CurrencyEnum, MonthEnum, TransactionType } from '../../../enums';
import { CreateCategoryRequest } from '../category';

export interface BodyRequest {
  type: TransactionType;
  amount: number;
  day: number;
  month: MonthEnum;
  year: number;
  currency: CurrencyEnum;
  note: string;
  exchangeRate?: number;
  userId: string;
  categoryId?: string;
  category?: CreateCategoryRequest;
  goalId?: string;
}

export class CreateTransactionRequest implements BodyRequest {
  readonly type: TransactionType;
  readonly amount: number;
  readonly day: number;
  readonly month: MonthEnum;
  readonly year: number;
  readonly currency: CurrencyEnum;
  readonly exchangeRate?: number;
  readonly note: string;
  readonly userId: string;
  readonly goalId?: string;
  public categoryId?: string;
  public category?: CreateCategoryRequest;

  constructor({
    type,
    amount,
    day,
    month,
    year,
    currency,
    exchangeRate,
    note,
    userId,
    categoryId,
    category,
    goalId,
  }: BodyRequest) {
    this.note = note;
    this.type = type;
    this.amount = amount;
    this.currency = currency;
    this.exchangeRate = exchangeRate;
    this.userId = userId;
    this.day = day;
    this.month = month;
    this.year = year;
    this.goalId = goalId;
    if (!categoryId) {
      this.category = category;
    } else {
      this.categoryId = categoryId;
    }
  }
}
