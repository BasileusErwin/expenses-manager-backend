import express, { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { routerIndex } from './routes';
import { sequelize } from './models';
import { ApiError } from './enums';
import { customErrors, CustomError, CustomResponse, logger } from './lib';
import helmet from 'helmet';

// rome-ignore lint/suspicious/noExplicitAny: default
const exceptionMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
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
      logger.info('database_connection_succesful');
    } catch (error) {
      logger.error(error, 'database_connection_failed');
      throw error;
    }
  }

  private configureLogging() {
    this.server.use(morgan('dev'));
  }

  private configureMiddleware() {
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(cookieParser());
  }

  private configureRoutes() {
    this.server.use('/api', routerIndex);
    this.server.use((req: Request, res: Response) => {
      const customError = customErrors[ApiError.Server.NOT_FOUND];
      res.status(404);
      res.send(new CustomResponse(false, customError));
    });
    this.server.use(exceptionMiddleware);
  }
}
