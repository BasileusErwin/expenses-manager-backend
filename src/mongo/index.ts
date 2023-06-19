import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../lib';

export const connectMongoDatabase = async () => {
  try {
    await mongoose.connect(config.mongodbUrl, {
      autoIndex: true,
    });

    logger.info('Successfully connected to Mongo Database');
  } catch (err) {
    logger.error(
      {
        err,
      },
      'Could not connect to Mongo Database',
    );
    throw err;
  }
};

export { ShoppingList } from './models/shopping_list.model';
