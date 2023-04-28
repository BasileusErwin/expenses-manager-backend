import pino from 'pino';
import { config } from '../config';

const transport = ['LOCAL', 'TEST'].includes(config.env)
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    }
  : null;

export const logger = pino({
  level: 'trace',
  base: null,
  transport,
  nestedKey: 'data',
  serializers: {
    // Needed because errors don't get serialized when using nestedKey
    /* eslint-disable */
    // rome-ignore lint/suspicious/noExplicitAny: default
    data: (data: any | Error) => {
      if (data instanceof Error) {
        return { err: pino.stdSerializers.err(data) };
      }

      if (data.err) {
        data.err = pino.stdSerializers.err(data.err);
      }

      return data;
    },
  },
});
