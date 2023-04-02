import { NextFunction, Request, Response } from 'express';
import { RegisterUserRequest } from '../types/request/user';
import { validationHelper } from '../helpers';
import { CustomResponse } from '../lib';
import { UserService } from '../services';
import { BodyRequest } from '../types/request/user/register_user';
import { TransactionModel } from '../models/index';
import { ApiError } from '../enums';
import { CustomError } from '../lib';

const userService: UserService = new UserService();

export class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      validationHelper.checkValidation(req);

      const body = new RegisterUserRequest(req.body as BodyRequest);

      const user: RegisterUserRequest = new RegisterUserRequest(body);

      return res.send(new CustomResponse(true, await userService.createUser(user)));
    } catch (err) {
      next(err);
    }
  }

  public async getUserById(_req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals;

      if (!userId) {
        throw new CustomError(ApiError.Server.TOO_FEW_PARAMS);
      }

      const user = await userService.getUser({ userId }, [
        {
          model: TransactionModel,
        },
      ]);

      return res.send(new CustomResponse(true, user));
    } catch (err) {
      next(err);
    }
  }
}
