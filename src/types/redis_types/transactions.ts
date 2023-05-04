import { RedisMetadata } from '.';
import { MonthEnum, TransactionType } from '../../enums';

export interface TransactionMetadata {
  type?: TransactionType;
  day?: number;
  month?: MonthEnum;
  year?: number;
  userId?: string
}

export class TransactionsRedisMetadata<T> implements RedisMetadata<T, TransactionMetadata> {
  readonly object: T;
  readonly metadata: TransactionMetadata;

  constructor(object: T, metadata: TransactionMetadata) {
    this.object = object;
    this.metadata = metadata;
  }

  public queryIsEqualToData(where: TransactionMetadata): boolean {
    if (this?.metadata?.type !== where?.type) {
      return false;
    }

    if (this?.metadata?.day !== where?.day) {
      return false;
    }

    if (this?.metadata?.month !== where?.month) {
      return false;
    }

    if (this?.metadata?.year !== where?.year) {
      return false;
    }

    return true;
  }
}
