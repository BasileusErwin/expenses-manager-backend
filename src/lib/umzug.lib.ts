import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from '../models';
import { logger } from '.';

const sequelizeConfig = sequelize();

export const umzug = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    resolve: ({ name, path, context }) => {
      const migration = require(path || ''); // eslint-disable-line
      return {
        name,
        up: async () => await migration.up(context, Sequelize), // eslint-disable-line
        down: async () => await migration.down(context, Sequelize), // eslint-disable-line
      };
    },
  },
  context: sequelizeConfig.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: sequelizeConfig }),
  logger,
});
