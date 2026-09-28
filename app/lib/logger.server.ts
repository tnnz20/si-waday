import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let metaStr = '';
  if (Object.keys(metadata).length > 0) {
    metaStr = ` ${JSON.stringify(metadata)}`;
  }
  return `[${timestamp}] ${level}: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: logLevel,
  format: isProduction
    ? combine(timestamp(), json())
    : combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), devFormat),
  transports: [new winston.transports.Console()],
});
