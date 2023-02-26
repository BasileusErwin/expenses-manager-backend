import { Exclude, Expose, Type } from 'class-transformer';
import { TransactionType } from '../../../enums/index';
import { TransactionDTO } from '..';

@Exclude()
export class CategoryDTO {
  @Expose()
  readonly categoryId: string;

  @Expose()
  readonly type: TransactionType;

  @Expose()
  readonly value: string;

  @Expose()
  readonly note: string;

  @Type(() => TransactionDTO)
  readonly trasactions: TransactionDTO[];
}
