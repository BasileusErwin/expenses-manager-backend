import { Request, Response, NextFunction } from 'express';
import { validationHelper } from '../helpers';
import { CustomResponse } from '../lib';
import { authService } from '../services';

interface LoginRequest {
  email: string;
  password: string;
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    validationHelper.checkValidation(req);

    const { email, password }: LoginRequest = req.body;
    const { sessionID } = req;

    const response = await authService.login(email, password, sessionID);

    return res.send(new CustomResponse(true, response));
  } catch (err) {
    next(err);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionID } = req;

    await authService.logout(sessionID);

    return res.send(new CustomResponse(true));
  } catch (err) {
    next(err);
  }
}
export const authController = {
  login,
  logout,
};
