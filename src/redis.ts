import RedisStore from 'connect-redis';
import { createClient, RedisClientType } from 'redis';
import { config } from './config';
import { logger } from './lib';

const client: RedisClientType = createClient({
  url: config.redisUrl,
});

client.connect();

client.on('error', (err) => logger.error({ err }, 'Redis Client Error'));

export const redisKeyLifetime: number = 30 * 24 * 60 * 60 * 1000 // 30 days

export const redisStore = new RedisStore({
  client: client,
  prefix: 'session:',
})

export const redisClient: RedisClientType = client;
