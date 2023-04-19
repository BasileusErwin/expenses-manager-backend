import { CurrencyEnum, FinancialGoalsType, MonthEnum } from '../../../enums/index';

export interface CreateFinancialGoalBody {
  type: FinancialGoalsType;
  targetAmount: number;
  currency: CurrencyEnum;
  note: string;
  month: MonthEnum;
  year: number;
  userId: string;
  name: string;
}

export class CreateFinancialGoal implements CreateFinancialGoalBody {
  readonly type: FinancialGoalsType;
  readonly targetAmount: number;
  readonly currency: CurrencyEnum;
  readonly note: string;
  readonly name: string;
  readonly month: MonthEnum;
  readonly year: number;
  readonly userId: string;

  constructor({ name, year, month, type, currency, note, userId, targetAmount }: CreateFinancialGoalBody) {
    this.name = name;
    this.type = type;
    this.targetAmount = targetAmount;
    this.currency = currency;
    this.note = note;
    this.month = month;
    this.year = year;
    this.userId = userId;
  }
}
