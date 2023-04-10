import { TransactionType } from '../../../enums';

export interface BodyRequest {
  type: TransactionType;
  value: string;
  note: string;
  userId: string;
}

export class CreateCategoryRequest {
  readonly type: TransactionType;
  readonly value: string;
  readonly note: string;
  readonly userId: string;

  constructor({ type, value, note, userId }: BodyRequest) {
    this.value = value;
    this.type = type;
    this.note = note;
    this.userId = userId;
  }
}
