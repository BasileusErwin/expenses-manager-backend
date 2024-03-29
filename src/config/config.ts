export const config = {
  env: process.env.ENV?.toUpperCase(),
  databaseUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT) || 3000,
  redisUrl: process.env.REDIS_URL,
  sessionSecret: process.env.SESSION_SECRET,
  mongodbUrl: process.env.MONGO_URL,
  corsOrigins: JSON.parse(process.env.CORS_ORIGINS),
};
