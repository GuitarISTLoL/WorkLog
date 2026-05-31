import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import jsonStringify from 'fast-safe-stringify';
import fs from 'fs';
import path from 'path';

process.env.TZ = 'Europe/Moscow';

const customFormat = winston.format.printf(
  ({ timestamp, level, message, ...meta }) => {
    const stringifiedMeta = jsonStringify(meta);

    let result = `${timestamp} ${level}: ${message}`;

    if (stringifiedMeta !== '{}') {
      result += ` | ${stringifiedMeta}`;
    }

    return result;
  },
);

const logDirectory = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logger = winston.createLogger({
  level: 'debug',

  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss.SSS',
    }),
  ),

  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(winston.format.colorize(), customFormat),
    }),

    new DailyRotateFile({
      filename: path.join(logDirectory, 'info-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: winston.format.combine(winston.format.uncolorize(), customFormat),
    }),

    new DailyRotateFile({
      filename: path.join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(winston.format.uncolorize(), customFormat),
    }),

    new DailyRotateFile({
      filename: path.join(logDirectory, 'debug-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'debug',
      format: winston.format.combine(winston.format.uncolorize(), customFormat),
    }),
  ],
});

export default logger;
