import { Request, Response, NextFunction } from 'express';
import { middlewareService } from '../services';

async function authorization(req: Request, res: Response, next: NextFunction) {
  try {
    await middlewareService.authorization(req, res, next);
  } catch (err) {
    next(err);
  }
}

function onlyLogin(req: Request, res: Response, next: NextFunction) {
  try {
    middlewareService.onlyLogin(req, res, next);
  } catch (err) {
    next(err);
  }
}

export const middlewareController = {
  onlyLogin,
  authorization,
};
