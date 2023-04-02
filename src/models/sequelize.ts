import { logger } from '../lib';
import { Sequelize } from 'sequelize-typescript';
import { config } from '../config';

let sequelizeInstance: Sequelize;

export const sequelize = () => {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  let models = [`${__dirname}/*.model.js`];

  const env = config.env;
  if (env === 'LOCAL' || env === 'TEST') {
    models = [`${__dirname}/*.model.ts`];
  }

  sequelizeInstance = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      timezone: 'Etc/GMT0',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    define: {
      underscored: true,
      freezeTableName: true,
    },
    logging: (str) => {
      if (!['PROD'].includes(config.env)) {
        logger.debug(str);
      }
    },
    models,
    modelMatch: (filename, member) => {
      return filename.substring(0, filename.indexOf('.model')).replace(/_/g, '') === member.toLowerCase();
    },
  });

  return sequelizeInstance;
};
