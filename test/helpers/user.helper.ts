import { SuperTest, Request, Response } from 'supertest';
import { Helper } from '.';
import { RegisterUserRequest } from '../../src/types/request/user';
import { genericFactory } from '../factories';
import { parseCSV } from '../utils';
import { SessionModel, UserModel } from '../../src/models';
import { SessionCSV, UserCSV } from '../../src/types/csv';

export class UserHelper extends Helper {
  readonly tokenMock: string =
    '092fcaa6465ed8ea9e4d06c7227b085f818082b0418a49cc8ed2d727150823cb27f3e6e1db295e15440519b7c7fa93fdb4de';
  readonly userIdMock: string = '255752d5-f350-4b33-ab70-7ad5c8c54650';

  constructor(request: SuperTest<Request>) {
    super(request);
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

  public async logout(token: string) {
    return await this.request
      .delete('/api/auth/logout')
      .set(genericFactory.buildHeader())
      .set('Cookie', `token=${token}`)
      .send();
  }

  public async getUser(token: string) {
    return await this.request
      .get('/api/users')
      .set(genericFactory.buildHeader())
      .set('Cookie', `token=${token}`)
      .send();
  }

  public async createUserFromCSV() {
    const users: UserCSV[] = await parseCSV<UserCSV>('../mock/seeds/users.csv');
    const sessions: SessionCSV[] = await parseCSV<SessionCSV>('../mock/seeds/session.csv');

    for (const user of users) {
      await UserModel.create({
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password,
        email: user.email,
      } as UserModel);
    }

    for (const session of sessions) {
      await SessionModel.create({
        sessionId: session.session_id,
        userId: session.user_id,
        token: session.token,
      } as SessionModel);
    }
  }
}
