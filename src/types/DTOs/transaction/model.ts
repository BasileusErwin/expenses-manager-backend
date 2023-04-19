import { Exclude, Expose, Type } from 'class-transformer';
import { CurrencyEnum, MonthEnum, TransactionType } from '../../../enums';
import { FinancialGoalDTO, CategoryDTO, UserDTO } from '..';

@Exclude()
export class TransactionDTO {
  @Expose()
  readonly transactionId: string;

  @Expose()
  readonly type: TransactionType;

  @Expose()
  readonly amount: number;

  @Expose()
  readonly currency: CurrencyEnum;

  @Expose()
  readonly note: string;

  @Expose()
  readonly day: number;

  @Expose()
  readonly month: MonthEnum;

  @Expose()
  readonly year: number;

  @Expose()
  readonly exchangeRate: number;

  @Expose()
  readonly deletedAt: Date;

  @Expose()
  readonly userId: string;

  @Type(() => UserDTO)
  @Expose()
  readonly user: UserDTO;

  @Expose()
  readonly categoryId: string;

  @Type(() => CategoryDTO)
  @Expose()
  readonly category: CategoryDTO;
  @Expose()
  public goalId: string;

  @Type(() => FinancialGoalDTO)
  @Expose()
  public financialGoal: FinancialGoalDTO;
}
