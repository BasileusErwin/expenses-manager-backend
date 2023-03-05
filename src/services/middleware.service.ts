import { NextFunction, Request, Response } from 'express';
import { SessionModel } from '../models';
import { UserService } from '.';
import { CustomError } from '../lib';
import { ApiError } from '../enums';
import { UserDTO } from '../types/DTOs';

export class MiddlewareService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async authorization(req: Request, res: Response, next: NextFunction) {
    const { token } = req.cookies;

    if (!token) {
      return next();
    }

    const user: UserDTO = await this.userService.getUserByFilter({}, [
      {
        model: SessionModel,
        where: {
          token
        }
      }
    ]);

    if (!user) {
      throw new CustomError(ApiError.Auth.EXPIRED_TOKEN);
    }

    res.locals.userId = user.userId;

    next();
  }
}
