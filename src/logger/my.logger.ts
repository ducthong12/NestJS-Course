import { LoggerService } from '@nestjs/common';
import chalk from 'chalk';
import { createLogger, Logger, transports, format } from 'winston';
import dayjs from 'dayjs';

export class MyLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, message, level, time }) => {
              const strApp = chalk.green('[Nest]');
              const strContext = chalk.yellow(`[${String(context)}]`);
              // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
              return `${strApp} - ${time} ${level} ${strContext} ${message || ''}`;
            }),
          ),
        }),
      ],
    });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
    this.logger.log('info', message, { context, time });
  }
  /**
   * Write an 'error' level log.
   */
  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
    this.logger.log('error', message, { context, time });
  }
  /**
   * Write a 'warn' level log.
   */
  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
    this.logger.log('warn', message, { context, time });
  }
  /**
   * Write a 'debug' level log.
   */
  debug?(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
    this.logger.log('debug', message, { context, time });
  }
  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
    this.logger.log('verbose', message, { context, time });
  }
  /**
   * Write a 'fatal' level log.
   */
  fatal?(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
    this.logger.log('fatal', message, { context, time });
  }
}
