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
}
