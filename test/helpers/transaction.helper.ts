import { SuperTest, Request } from 'supertest';
import { Helper } from '.';

export class TransactionHelper extends Helper {
  constructor(request: SuperTest<Request>) {
    super(request);
  }
}
