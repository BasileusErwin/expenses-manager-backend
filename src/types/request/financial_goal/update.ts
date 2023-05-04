import { CurrencyEnum, FinancialGoalsType, MonthEnum } from '../../../enums/index';

export interface UpdateOptions {
  type?: FinancialGoalsType;
  targetAmount?: number;
  currency?: CurrencyEnum;
  note?: string;
  month?: MonthEnum;
  year?: number;
  name?: string;
  currentAmount?: number;
}

export class FinancialGoalUpdateOptions implements UpdateOptions {
  readonly type: FinancialGoalsType;
  readonly targetAmount: number;
  readonly currency: CurrencyEnum;
  readonly note: string;
  readonly month: MonthEnum;
  readonly year: number;
  readonly name: string;
  readonly currentAmount: number;

  constructor({ type, targetAmount, currency, note, month, year, name, currentAmount }: UpdateOptions) {
    this.name = name;
    this.targetAmount = targetAmount;
    this.type = type;
    this.currency = currency;
    this.note = note;
    this.month = month;
    this.year = year;
    this.currentAmount = currentAmount;
  }
}
