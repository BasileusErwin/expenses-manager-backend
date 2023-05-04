import 'jest';
import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { App } from '../../src/app';
import { ApiError, CurrencyEnum, FinancialGoalsType } from '../../src/enums';
import { financialGoalFactory } from '../factories';
import { databaseHelper, FinancialGoalHelper, UserHelper } from '../helpers';
import financialGoalMock from '../mock/financial_goal.json';
import { redisClient } from '../../src/redis';

describe('/api/financial_goals', () => {
  const app: App = new App();
  const request = supertest(app.server);
  const userHelper: UserHelper = new UserHelper(request);
  const financialGoalHelper: FinancialGoalHelper = new FinancialGoalHelper(request, userHelper.cookieMock);

  beforeAll(async () => {
    await app.connectToDatabase();
    await databaseHelper.destoryDatabase();
    await userHelper.createUserFromCSV();

  await redisClient.set(userHelper.sessionIdMock, userHelper.userIdMock);
  });

  describe('Create financial goal', () => {
    it('should return 200 if all data is valid for EUR currency and type saving', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.EUR,
          type: FinancialGoalsType.SAVING,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for EUR currency and type spend less', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.EUR,
          type: FinancialGoalsType.SPEND_LESS,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for UYU currency and type saving', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.UYU,
          type: FinancialGoalsType.SAVING,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for UYU currency and type spend less', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.UYU,
          type: FinancialGoalsType.SPEND_LESS,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for USD currency and type saving', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.USD,
          type: FinancialGoalsType.SAVING,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for USD currency and type spend less', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.USD,
          type: FinancialGoalsType.SPEND_LESS,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 400 if not all data is valid', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: undefined,
          type: FinancialGoalsType.SPEND_LESS,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Server.PARAMS_REQUIRED);
    });

    it('should return 401 if not include token', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.USD,
          type: FinancialGoalsType.SPEND_LESS,
        }),
        {
          notIncludeToken: true,
        },
      );

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });

  describe('Get all financial goals', () => {
    it('should return 200', async () => {
      const response = await financialGoalHelper.getFinancialGoals({
        notIncludeToken: false,
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 401', async () => {
      const response = await financialGoalHelper.getFinancialGoals({
        notIncludeToken: true,
      });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });

  describe('Get financial goal', () => {
    it('should return 200 if financial goal id is valid', async () => {
      const response = await financialGoalHelper.createFinancialGoal(
        financialGoalFactory.buildFinancialGoal({
          currency: CurrencyEnum.EUR,
          type: FinancialGoalsType.SPEND_LESS,
        }),
        {
          notIncludeToken: false,
        },
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();

      const { goalId } = response.body.data;

      const financialGoalResponse = await financialGoalHelper.getFinancialGoal(goalId, {
        notIncludeToken: false,
      });

      expect(financialGoalResponse.status).toBe(StatusCodes.OK);
      expect(financialGoalResponse.body.result).toBeTruthy();
      expect(financialGoalResponse.body.data).toMatchObject(financialGoalMock);
    });

    it('should return 404 if financial goal not exists', async () => {
      const financialGoalResponse = await financialGoalHelper.getFinancialGoal(
        '255752d5-f350-4b33-ab70-7ad5c8c54650',
        {
          notIncludeToken: false,
        },
      );

      expect(financialGoalResponse.status).toBe(StatusCodes.NOT_FOUND);
      expect(financialGoalResponse.body.result).toBeFalsy();
      expect(financialGoalResponse.body.errorCode).toBe(ApiError.FinancialGoal.FINANCIAL_GOAL_NOT_EXIST);
    });

    it('should return 401', async () => {
      const financialGoalResponse = await financialGoalHelper.getFinancialGoal(
        '255752d5-f350-4b33-ab70-7ad5c8c54650',
        {
          notIncludeToken: true,
        },
      );

      expect(financialGoalResponse.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(financialGoalResponse.body.result).toBeFalsy();
      expect(financialGoalResponse.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });
});
