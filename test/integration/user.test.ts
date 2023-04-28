import "jest";
import supertest, { SuperTest, Request } from "supertest";
import { App } from "../../src/app";
import { ApiError } from "../../src/enums";
import { RegisterUserRequest } from "../../src/types/request/user";
import { userFactory } from "../factories";
import { databaseHelper, UserHelper } from "../helpers";
import userMock from "../mock/user.json";

describe("/api/users", () => {
  let app: App;
  const user: RegisterUserRequest = userFactory.user;
  let userHelper: UserHelper;
  let token: string;

  beforeAll(async () => {
    app = new App();
    await app.connectToDatabase();
    await databaseHelper.destoryDatabase();
    userHelper = new UserHelper(supertest(app.server));
  });

  describe("Create a new user", () => {
    it("should create a new user", async () => {
      const response = await userHelper.createUser(user);

      expect(response.status).toBe(200);
    });

    it("should not create a new user with email exist in database", async () => {
      const response = await userHelper.createUser(user);

      expect(response.status).toBe(409);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.User.USER_ALREADY_EXISTS);
    });

    it("should not create a new user if send a object empty", async () => {
      const response = await userHelper.createUser({
        password: "",
        lastName: "",
        firstName: "",
        email: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.result).toBeFalsy();
    });
  });

  describe("Login", () => {
    it("should return token session", async () => {
      const response = await userHelper.login({
        email: user.email,
        password: user.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.data.token).not.toBeUndefined();

      token = response.body.data.token;
    });

    it("should not return token if send object empty", async () => {
      const response = await userHelper.login({
        email: "",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.result).toBeFalsy();
    });
  });

  describe("Get user info", () => {
    it("should return user data", async () => {
      const response = await userHelper.getUser(token);

      expect(response.status).toBe(200);
      expect(response.body.result).toBeTruthy();
      expect(response.body.data).toMatchObject(userMock);
    });

    it("should not return user data if not send user token", async () => {
      const response = await userHelper.getUser("");

      expect(response.status).toBe(400);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });

  describe("Logout", () => {
    it("should logout successfully", async () => {
      const response = await userHelper.logout(token)

      expect(response.status).toBe(200);
      expect(response.body.result).toBeTruthy();
    });

    it("should not logout if send empty token", async () => {
      const response = await userHelper.logout("");

      expect(response.status).toBe(400);
      expect(response.body.result).toBeFalsy();
      expect(response.body.errorCode).toBe(ApiError.Auth.NEED_BE_LOGGED_IN);
    });
  });
});
