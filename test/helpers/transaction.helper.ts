import { SuperTest, Request, Response } from 'supertest';
import { Helper } from '.';
import { CreateTransactionRequest } from '../../src/types/request/trsactions';
import { genericFactory } from '../factories';
import { RequestOptions } from '../types';

export class TransactionHelper extends Helper {
  private endpoint: string = '/api/transactions';
  readonly userToken: string;

  constructor(request: SuperTest<Request>, userToken: string) {
    super(request);
    this.userToken = userToken;
  }

  public async createTransaction(body: CreateTransactionRequest, options: RequestOptions): Promise<Response> {
    const request = this.request
      .post(this.endpoint)
      .set(genericFactory.buildHeader());

    if (!options.notIncludeToken) {
      request.set("Cookie", `token=${this.userToken}`);
    }

    return await request.send(body);
  }
}
