import { TransactionType } from '../../../enums';

export interface BodyRequest {
  type: TransactionType;
  name: string;
  note: string;
  userId: string;
}

export class CreateCategoryRequest {
  readonly type: TransactionType;
  readonly name: string;
  readonly note: string;
  readonly userId: string;

  constructor({ type, name, note, userId }: BodyRequest) {
    this.name = name;
    this.type = type;
    this.note = note;
    this.userId = userId;
  }
}
