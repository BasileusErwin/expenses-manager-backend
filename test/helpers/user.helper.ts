import { SuperTest, Request, Response } from 'supertest';
import { Helper } from '.';
import { RegisterUserRequest } from '../../src/types/request/user';
import { genericFactory } from '../factories';
import { parseCSV } from '../utils';
import { SessionModel, UserModel } from '../../src/models';
import { SessionCSV, UserCSV } from '../../src/types/csv';

export class UserHelper extends Helper {
  readonly userIdMock: string = '255752d5-f350-4b33-ab70-7ad5c8c54650';
  readonly sessionIdMock: string = '2YDn3FaFbkn76oZuHDccyM_mwYv6Xzn_';

  constructor(request: SuperTest<Request>) {
    super(
      request,
      'sessionID=s%3A2YDn3FaFbkn76oZuHDccyM_mwYv6Xzn_.mxQGXbQRwkpECY0Ixre9KwEvxhjcABgc%2BXZeEyXOOyI; Path=/; HttpOnly; Expires=Sat, 03 Jun 2023 14:03:03 GMT;',
    );
  }

  public async createUser(body: RegisterUserRequest): Promise<Response> {
    return await this.request.post('/api/users').set(genericFactory.buildHeader()).send(body);
  }

  public async login(body: {
    email: string;
    password: string;
  }): Promise<Response> {
    return await this.request.post('/api/auth/login').set(genericFactory.buildHeader()).send(body);
  }

  public async logout(cookie: string) {
    return await this.request
      .delete('/api/auth/logout')
      .set(genericFactory.buildHeader())
      .set('Cookie', cookie)
      .send();
  }

  public async getUser(cookie: string) {
    return await this.request
      .get('/api/users')
      .set(genericFactory.buildHeader())
      .set('Cookie', cookie)
      .send();
  }

  public async createUserFromCSV() {
    const users: UserCSV[] = await parseCSV<UserCSV>('../mock/seeds/users.csv');

    for (const user of users) {
      await UserModel.create({
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password,
        email: user.email,
      } as UserModel);
    }
  }
}
