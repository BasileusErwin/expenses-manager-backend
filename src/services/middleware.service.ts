import { ApiError } from '../enums';
import { CustomError, logger } from '../lib';
import { SessionModel, UserModel } from '../models';
import { NextFunction, Request, Response } from 'express';

function onlyLogin(_req: Request, res: Response, next: NextFunction) {
  if (!res.locals.userId) {
    throw new CustomError(ApiError.Auth.NEED_BE_LOGGED_IN);
  }

  return next();
}

async function authorization(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;

  logger.debug({ token });

  if (!token) {
    return next();
  }

  const session: SessionModel = await SessionModel.findOne({
    where: {
      token,
    },
    include: [
      {
        model: UserModel,
      },
    ],
  });

  logger.debug({ session });

  if (!session?.user) {
    throw new CustomError(ApiError.Auth.EXPIRED_TOKEN);
  }

  res.locals.userId = session.userId;

  next();
}

export const middlewareService = {
  onlyLogin,
  authorization,
};
