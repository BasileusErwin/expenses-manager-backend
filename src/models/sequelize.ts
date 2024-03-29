import { logger } from '../lib';
import { Sequelize } from 'sequelize-typescript';
import { config } from '../config';

let sequelizeInstance: Sequelize;

export const sequelize = () => {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }
  const env = config.env;

  const models = [`${__dirname}/${['LOCAL', 'TEST'].includes(env) ? '/*.model.ts' : '*.model.js'}`];

  sequelizeInstance = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      timezone: 'Etc/GMT0',
    },
    pool: {
      max: 100,
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
