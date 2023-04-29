import { SuperTest, Request, Response } from 'supertest';
import { Helper } from '.';
import { CreateFinancialGoal } from '../../src/types/request/financial_goal';
import { genericFactory } from '../factories';
import { RequestOptions } from '../types';

export class FinancialGoalHelper extends Helper {
  readonly userToken: string;
  private endpoint: string = '/api/financial_goals';

  constructor(request: SuperTest<Request>, token: string) {
    super(request);
    this.userToken = token;
  }

  public async createFinancialGoal(body: CreateFinancialGoal, options: RequestOptions): Promise<Response> {
    const request = this.request.post(this.endpoint).set(genericFactory.buildHeader());

    if (!options?.notIncludeToken) {
      request.set('Cookie', `token=${this.userToken}`);
    }

    return await request.send(body);
  }

  public async getFinancialGoals(options: RequestOptions): Promise<Response> {
    const request = this.request.get(this.endpoint).set(genericFactory.buildHeader());

    if (!options?.notIncludeToken) {
      request.set('Cookie', `token=${this.userToken}`);
    }

    return await request.send();
  }

  public async getFinancialGoal(financialGoalId: string, options: RequestOptions): Promise<Response> {
    const request = this.request.get(`${this.endpoint}/${financialGoalId}`).set(genericFactory.buildHeader());

    if (!options?.notIncludeToken) {
      request.set('Cookie', `token=${this.userToken}`);
    }

    return await request.send();
  }
}
