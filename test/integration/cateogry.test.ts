import 'jest';
import supertest from 'supertest';
import { App } from '../../src/app';
import { StatusCodes } from 'http-status-codes';
import { ApiError, TransactionType } from '../../src/enums';
import { categoryFactory } from '../factories';
import { CategoryHelper, databaseHelper, UserHelper } from '../helpers';
import categoryMock from '../mock/category.json';

describe('/api/cateogries', () => {
  const app: App = new App();
  let userHelper: UserHelper;
  let categoryHelper: CategoryHelper;

  beforeAll(async () => {
    const request = supertest(app.server);

    await app.connectToDatabase();
    await databaseHelper.destoryDatabase();

    userHelper = new UserHelper(request);
    await userHelper.createUserFromCSV();

    categoryHelper = new CategoryHelper(request, userHelper.tokenMock);
  });

  describe('Create category', () => {
    it('should return 200 if all data is valid for INCOME', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: TransactionType.INCOME,
        }),
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for EXPENSE', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: TransactionType.EXPENSE,
        }),
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for SAVING', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: TransactionType.SAVING,
        }),
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 200 if all data is valid for INSTALLMENTS', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: TransactionType.INSTALLMENTS,
        }),
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 400 if any data is not valid', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: undefined,
        }),
      );

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.result).toBeFalsy();
    });

    it('should return 401 if not include token', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: TransactionType.INCOME,
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

  describe('Get All Categories', () => {
    it('should return 200 if exists categories by user id', async () => {
      const response = await categoryHelper.getCategories({
        notIncludeToken: false,
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it('should return 401 if not include token', async () => {
      const response = await categoryHelper.getCategories({
        notIncludeToken: true,
      });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });

  describe('Get category', () => {
    it('should return 200 and category data', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: TransactionType.EXPENSE,
        }),
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();

      const { categoryId } = response.body.data;

      const categoryResponse = await categoryHelper.getCategory(categoryId, {
        notIncludeToken: false,
      });

      expect(categoryResponse.status).toBe(StatusCodes.OK);
      expect(categoryResponse.body.result).toBeTruthy();
      expect(categoryResponse.body.data).toMatchObject(categoryMock);
    });

    it('should return 400 if not send a valid uuid', async () => {
      const response = await categoryHelper.getCategory('dsdadsad-dsaddad', {
        notIncludeToken: false,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Server.PARAMS_REQUIRED);
    });

    it('should return 404 if category does not exist', async () => {
      const response = await categoryHelper.getCategory('255752d5-f350-4b33-ab70-7ad5c8c54650', {
        notIncludeToken: false,
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Category.CATEGORY_NOT_EXIST);
    });
  });

  describe('Delete Category', () => {
    it('should return 200 if delete succeeds', async () => {
      const response = await categoryHelper.createCategory(
        categoryFactory.buildCategory({
          type: TransactionType.EXPENSE,
        }),
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();

      const { categoryId } = response.body.data;

      const deleteResponse = await categoryHelper.deleteCategory(categoryId, {
        notIncludeToken: false,
      });

      expect(deleteResponse.status).toBe(StatusCodes.OK);
      expect(deleteResponse.body.result).toBeTruthy();
    });

    it('should return 404 if category does not exist', async () => {
      const response = await categoryHelper.deleteCategory('255752d5-f350-4b33-ab70-7ad5c8c54650', {
        notIncludeToken: false,
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Category.CATEGORY_NOT_EXIST);
    });
  });
});
