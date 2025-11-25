import { createLogger, format, transports } from 'winston';

const dev = process.env.NODE_ENV !== 'production';

const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(info => {
    const { timestamp, level, message, stack, ...rest } = info;
    const meta = Object.keys(rest).length ? ` | ${JSON.stringify(rest, null, 2)}` : '';
    const stackPart = stack ? `\n${stack}` : '';
    return `${timestamp} ${level}: ${message}${meta}${stackPart}`;
  })
);

const logger = createLogger({
  level: 'info',
  format: dev
    ? devFormat
    : format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [new transports.Console()]
});

export default logger