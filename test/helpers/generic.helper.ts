import { SuperTest, Request } from 'supertest';

export abstract class Helper {
  readonly request: SuperTest<Request>;
  readonly cookieMock: string;

  constructor(request: SuperTest<Request>, cookieMock: string) {
    this.request = request;
    this.cookieMock = cookieMock;
  }
}
