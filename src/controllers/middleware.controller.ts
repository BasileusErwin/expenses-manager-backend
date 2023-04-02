import { Request, Response, NextFunction } from 'express';
import { MiddlewareService } from '../services';

const middlewareService: MiddlewareService = new MiddlewareService();

export class MiddlewareController {
  public async authorization(req: Request, res: Response, next: NextFunction) {
    try {
      await middlewareService.authorization(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  public onlyLogin(req: Request, res: Response, next: NextFunction) {
    try {
      middlewareService.onlyLogin(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}
