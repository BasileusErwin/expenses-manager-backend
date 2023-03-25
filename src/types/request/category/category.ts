import { TransactionType } from '../../../enums';

export interface BodyRequest {
  type: TransactionType;
  value: string;
  note: string;
}

export class CreateCategoryRequest {
  readonly type: TransactionType;
  readonly value: string;
  readonly note: string;

  constructor({ type, value, note }: BodyRequest) {
    this.value = value;
    this.type = type;
    this.note = note;
  }
}
