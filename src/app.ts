import 'reflect-metadata';
import express, { NextFunction } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { Request, Response } from 'express-serve-static-core';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { routerIndex } from './routes';
import { sequelize } from './models';
import { ApiError } from './enums';
import { customErrors, CustomError, CustomResponse, logger } from './lib';
import { redisKeyLifetime, redisStore } from './redis';

const exceptionMiddleware = <T extends Error>(err: T, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    logger.error({ err }, 'Exception Middleware');
    const httpStatus = customErrors[err.errorCode] && customErrors[err.errorCode].HTTPStatusCode;
    return res.status(httpStatus || 500).send(new CustomResponse(false, err.data, err.errorCode));
  }

  logger.error(err);
  res.status(500);

  if (['TEST', 'QA', 'DEV'].includes(config.env)) {
    return res.send(new CustomResponse(false, err));
  }

  return res.send(new CustomResponse(false));
};

export class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.configureLogging();
    this.configureMiddleware();
    this.configureRoutes();
  }

  public async connectToDatabase() {
    try {
      await sequelize().authenticate();
    } catch (error) {
      logger.error(error, 'database_connection_failed');
      throw error;
    }
  }

  private configureLogging() {
    this.server.use(
      morgan('dev', {
        skip: (req: Request, _res: Response) => req.baseUrl === '/api/health',
      }),
    );
  }

  private configureMiddleware() {
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(helmet());
    this.server.use(cors());

    this.server.use(session({
      store: redisStore,
      resave: false,
      saveUninitialized: true,
      secret: config.sessionSecret,
      name: 'sessionID',
      cookie: {
        maxAge: redisKeyLifetime,
      }
    }))
  }

  private configureRoutes() {
    this.server.use('/api', routerIndex);
    this.server.use((_req: Request, res: Response) => {
      const customError = customErrors[ApiError.Server.NOT_FOUND];
      res.status(404);
      res.send(new CustomResponse(false, customError));
    });
    this.server.use(exceptionMiddleware);
  }
}
