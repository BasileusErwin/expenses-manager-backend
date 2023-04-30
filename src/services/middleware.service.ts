import { ApiError } from '../enums';
import { CustomError, logger } from '../lib';
import { NextFunction, Request, Response } from 'express';
import { redisClient } from 'src/redis';

function onlyLogin(_req: Request, res: Response, next: NextFunction) {
  if (!res.locals.userId) {
    throw new CustomError(ApiError.Auth.NEED_BE_LOGGED_IN);
  }

  return next();
}

async function authorization(req: Request, res: Response, next: NextFunction) {
  const token = req.sessionID;

  logger.debug({ token });

  if (!token) {
    return next();
  }

  const userId = await redisClient.get(token);

  if (!userId) {
    return next();
  }

  res.locals.userId = userId;

  next();
}

export const middlewareService = {
  onlyLogin,
  authorization,
};
