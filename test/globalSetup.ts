import { App } from "../src/app";
import { umzug } from "../src/lib";
import { sequelize } from "../src/models";

module.exports = async () => {
  await sequelize().authenticate();
  await umzug.up();
};
