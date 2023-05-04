import dotenv from 'dotenv';
dotenv.config();

import { config } from './config';
import { App } from './app';
import { logger, umzug } from './lib';

const port = config.port;
const app = new App();

app.server.listen(port, () => logger.info(`Server running on port ${port}`));

const handleDisconnect = () => {
  app
    .connectToDatabase()
    .then(async () => {
      logger.info('Connected to database ...');
      try {
        await umzug.up();
      } catch (err) {
        logger.info('ERROR WITH UMZUG');
        logger.error(err);
      }
    })
    .catch((err) => {
      logger.error(err, 'CONNECTION ERROR');
      logger.info('Trying to connect again');
      setTimeout(handleDisconnect, 10000);
    });
};

handleDisconnect();
