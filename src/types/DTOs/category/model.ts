import { Exclude, Expose, Type } from 'class-transformer';
import { TransactionType } from '../../../enums/index';
import { TransactionDTO, UserDTO } from '..';

@Exclude()
export class CategoryDTO {
  @Expose()
  readonly categoryId: string;

  @Expose()
  readonly type: TransactionType;

  @Expose()
  readonly name: string;

  @Expose()
  readonly note: string;

  @Expose()
  readonly userId: string;

  @Type(() => TransactionDTO)
  @Expose()
  readonly trasactions: TransactionDTO[];

  @Type(() => UserDTO)
  @Expose()
  readonly user: UserDTO[];
}
