import { SuperTest, Request, Response } from "supertest";
import { Helper } from ".";
import { RegisterUserRequest } from "../../src/types/request/user";
import { genericFactory } from "../factories";

export class UserHelper extends Helper {
  constructor(request: SuperTest<Request>) {
    super(request);
  }

  async createUser(body: RegisterUserRequest): Promise<Response> {
    return await this.request
      .post("/api/users")
      .set(genericFactory.buildHeader())
      .send(body);
  }

  async login(body: { email: string; password: string }): Promise<Response> {
    return await this.request
      .post("/api/auth/login")
      .set(genericFactory.buildHeader())
      .send(body);
  }

  async logout(token: string) {
    return await this.request
      .delete("/api/auth/logout")
      .set(genericFactory.buildHeader())
      .set("Cookie", `token=${token}`)
      .send();
  }

  async getUser(token: string) {
    return await this.request
      .get("/api/users")
      .set(genericFactory.buildHeader())
      .set("Cookie", `token=${token}`)
      .send();
  }
}
