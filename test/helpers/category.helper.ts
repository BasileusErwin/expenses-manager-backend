import { SuperTest, Request, Response } from 'supertest';
import { CreateCategoryRequest } from '../../src/types/request/category';
import { genericFactory } from '../factories';
import { Helper } from '.';

interface RequestOptions {
  notIncludeToken: boolean;
}

export class CategoryHelper extends Helper {
  readonly userToken: string;

  constructor(request: SuperTest<Request>, userToken: string) {
    super(request);
    this.userToken = userToken;
  }

  public async createCategory(category: CreateCategoryRequest, options?: RequestOptions): Promise<Response> {
    const request = this.request.post('/api/categories/').set(genericFactory.buildHeader());

    if (!options?.notIncludeToken) {
      request.set('Cookie', `token=${this.userToken}`);
    }

    return await request.send(category);
  }

  public async getCategories(options: RequestOptions): Promise<Response> {
    const request = this.request.get('/api/categories').set(genericFactory.buildHeader());

    if (!options.notIncludeToken) {
      request.set('Cookie', `token=${this.userToken}`);
    }

    return await request.send();
  }

  public async deleteCategory(categoryId: string, options: RequestOptions): Promise<Response> {
    const request = this.request.delete(`/api/categories/${categoryId}`).set(genericFactory.buildHeader());

    if (!options.notIncludeToken) {
      request.set('Cookie', `token=${this.userToken}`);
    }

    return await request.send();
  }

  public async getCategory(categoryId: string, options: RequestOptions): Promise<Response> {
    const request = this.request.get(`/api/categories/${categoryId}`).set(genericFactory.buildHeader());

    if (!options.notIncludeToken) {
      request.set('Cookie', `token=${this.userToken}`);
    }

    return await request.send();
  }
}
