import { NextFunction, Request, Response } from 'express';
import { RegisterUserRequest } from '../types/request/user';
import { validationHelper } from '../helpers';
import { CustomResponse } from '../lib';
import { UserService } from '../services';


export class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      validationHelper.checkValidation(req);

      const user: RegisterUserRequest = new RegisterUserRequest(req.body);

      return res.send(new CustomResponse(true, await UserService.createUser(user)));
    } catch (err) {
      next(err);
    }
  }
}
