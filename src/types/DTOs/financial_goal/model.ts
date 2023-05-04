import { Exclude, Expose, Type } from 'class-transformer';
import { CurrencyEnum, MonthEnum, FinancialGoalsType } from '../../../enums';
import { TransactionDTO, UserDTO } from '..';

@Exclude()
export class FinancialGoalDTO {
  @Expose()
  readonly goalId: string;

  @Expose()
  readonly type: FinancialGoalsType;

  @Expose()
  readonly targetAmount: number;

  @Expose()
  readonly currency: CurrencyEnum;

  @Expose()
  readonly currentAmount: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly note: string;

  @Expose()
  readonly month: MonthEnum;

  @Expose()
  readonly year: number;

  @Expose()
  readonly deletedAt: Date;

  @Expose()
  readonly userId: string;

  @Type(() => UserDTO)
  @Expose()
  readonly user: UserDTO;

  @Type(() => TransactionDTO)
  @Expose()
  public transactions: TransactionDTO[];
}
