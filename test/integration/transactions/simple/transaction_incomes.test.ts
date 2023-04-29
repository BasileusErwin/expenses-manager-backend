import { StatusCodes } from "http-status-codes";
import "jest";
import supertest from "supertest";
import { App } from "../../../../src/app";
import { ApiError, CurrencyEnum, TransactionType } from "../../../../src/enums";
import { transactionFactory } from "../../../factories";
import {
  CategoryHelper,
  databaseHelper,
  TransactionHelper,
  UserHelper,
} from "../../../helpers";

describe("/api/transactions Simple Income", () => {
  const app: App = new App();
  const request = supertest(app.server);
  const userHelper: UserHelper = new UserHelper(request);
  const categoryHelper: CategoryHelper = new CategoryHelper(
    request,
    userHelper.tokenMock
  );
  const transactionHelper: TransactionHelper = new TransactionHelper(
    request,
    userHelper.tokenMock
  );

  beforeAll(async () => {
    await app.connectToDatabase();
    await databaseHelper.destoryDatabase();
    await userHelper.createUserFromCSV();
    await categoryHelper.createUserFromCSV(userHelper.userIdMock);
  });

  describe("Create transaction type Income ", () => {
    const type: TransactionType = TransactionType.INCOME;

    it("should return 200 if all data is valid and currency UYU, Simple form with categoryId", async () => {
      const response = await transactionHelper.createTransaction(
        transactionFactory.buildTransaction({
          categoryId: categoryHelper.categoryIdByType.get(type),
          type,
          currency: CurrencyEnum.UYU,
        }),
        {
          notIncludeToken: false,
        }
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it("should return 200 if all data is valid and currency USD, Simple form with categoryId", async () => {
      const response = await transactionHelper.createTransaction(
        transactionFactory.buildTransaction({
          categoryId: categoryHelper.categoryIdByType.get(type),
          type,
          exchangeRate: 30.0,
          currency: CurrencyEnum.USD,
        }),
        {
          notIncludeToken: false,
        }
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.result).toBeTruthy();
    });

    it("should return 400 if don't send a exchangeRate if currency is USD", async () => {
      const response = await transactionHelper.createTransaction(
        transactionFactory.buildTransaction({
          categoryId: categoryHelper.categoryIdByType.get(type),
          type,
          currency: CurrencyEnum.USD,
        }),
        {
          notIncludeToken: false,
        }
      );

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Server.PARAMS_REQUIRED)
    });

    it("should return 400 if don't send a exchangeRate if currency is EUR", async () => {
      const response = await transactionHelper.createTransaction(
        transactionFactory.buildTransaction({
          categoryId: categoryHelper.categoryIdByType.get(type),
          type,
          currency: CurrencyEnum.EUR,
        }),
        {
          notIncludeToken: false,
        }
      );

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Server.PARAMS_REQUIRED)
    });
  });
});
