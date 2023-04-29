import { SuperTest, Request } from 'supertest';

export abstract class Helper {
  readonly request: SuperTest<Request>;

  constructor(request: SuperTest<Request>) {
    this.request = request;
  }
}
