export const config = {
  env: process.env.ENV?.toUpperCase(),
  databaseUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT) || 3000,
};
