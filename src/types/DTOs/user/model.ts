import { Exclude, Expose, Type } from 'class-transformer';
import { TransactionDTO, SessionDTO } from '..';

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
}
