import { Exclude, Expose, Type } from 'class-transformer';
import { CurrencyEnum, TransactionType } from '../../../enums/index';
import { CategoryDTO, UserDTO } from '..';

@Exclude()
export class TransactionDTO {
  @Expose()
  readonly transactionId: string;

  @Expose()
  readonly type: TransactionType;

  @Expose()
  readonly amount: number;

  @Expose()
  readonly date: Date;

  @Expose()
  readonly currency: CurrencyEnum;

  @Expose()
  readonly note: string;

  @Expose()
  readonly deletedAt: Date;

  @Expose()
  readonly userId: string;

  @Type(() => UserDTO)
  readonly user: UserDTO;

  @Expose()
  readonly categoryId: string;

  @Type(() => CategoryDTO)
  readonly category: CategoryDTO;
}
