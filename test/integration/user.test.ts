import 'jest';
import supertest from 'supertest';
import { App } from '../../src/app';
import { ApiError } from '../../src/enums';
import { logger } from '../../src/lib';
import { redisClient } from '../../src/redis';
import { RegisterUserRequest } from '../../src/types/request/user';
import { userFactory } from '../factories';
import { databaseHelper, UserHelper } from '../helpers';
import userMock from '../mock/user.json';

describe('/api/users', () => {
  let app: App;
  const user: RegisterUserRequest = userFactory.user;
  let userHelper: UserHelper;
  let cookie: string;

  beforeAll(async () => {
    app = new App();
    await app.connectToDatabase();
    await databaseHelper.destoryDatabase();
    userHelper = new UserHelper(supertest(app.server));
  });

  describe('Create a new user', () => {
    it('should create a new user', async () => {
      const response = await userHelper.createUser(user);

      expect(response.status).toBe(200);
    });

    it('should not create a new user with email exist in database', async () => {
      const response = await userHelper.createUser(user);

      expect(response.status).toBe(409);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.User.USER_ALREADY_EXISTS);
    });

    it('should not create a new user if send a object empty', async () => {
      const response = await userHelper.createUser({
        password: '',
        lastName: '',
        firstName: '',
        email: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.result).toBeFalsy();
    });
  });

  describe('Login', () => {
    it('should return cookie session', async () => {
      const response = await userHelper.login({
        email: user.email,
        password: user.password,
      });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();

      cookie = response.headers['set-cookie'][0].split(';')[0];

      console.log(cookie);
    });

    it('should not return cookie if send object empty', async () => {
      const response = await userHelper.login({
        email: '',
        password: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.result).toBeFalsy();
    });
  });

  describe('Get user info', () => {
    it('should return user data', async () => {
      const response = await userHelper.getUser(cookie);

      expect(response.status).toBe(200);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toMatchObject(userMock);
    });

    it('should not return user data if not send user cookie', async () => {
      const response = await userHelper.getUser('');

      expect(response.status).toBe(401);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const response = await userHelper.logout(cookie);

      expect(response.status).toBe(200);
      expect(response.body.result).toBeTruthy();
    });

    it('should not logout if send empty cookie', async () => {
      const response = await userHelper.logout('');

      expect(response.status).toBe(401);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });

  afterAll(async () => {
    await redisClient.quit();
  });
});
