import { sequelize } from '../../src/models';

async function destoryDatabase() {
  await sequelize().query(`
  TRUNCATE public."transactions" CASCADE;
  TRUNCATE public."financial_goals" CASCADE;
  TRUNCATE public."categories" CASCADE;
  TRUNCATE public."users" CASCADE;
`);
}

export const databaseHelper = { destoryDatabase };
