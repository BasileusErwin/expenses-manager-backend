import { Exclude, Expose, Type } from 'class-transformer';
import { FinancialGoalDTO, TransactionDTO, SessionDTO, CategoryDTO } from '..';

@Exclude()
export class UserDTO {
  @Expose()
  readonly userId: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly password: string;

  @Expose()
  readonly deletedAt: Date;

  @Type(() => SessionDTO)
  @Expose()
  readonly sessions: SessionDTO[];

  @Type(() => TransactionDTO)
  @Expose()
  readonly trasactions: TransactionDTO[];

  @Type(() => CategoryDTO)
  @Expose()
  readonly categories: CategoryDTO[];

  @Type(() => FinancialGoalDTO)
  @Expose()
  readonly financialGoals: FinancialGoalDTO[];
}
