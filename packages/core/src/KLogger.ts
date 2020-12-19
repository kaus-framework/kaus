import Log4js, { Logger, LoggingEvent } from 'log4js';
import { valueToBoolean } from './Utils';

let chalk = require('chalk');

export class KLogger {
  private logger: Logger;
  private level: string;

  constructor(category?: string, stdoutJson?: any) {
    Log4js.addLayout('single', (config) => (logEvent) => this.parseSingleOut(config, logEvent));
    Log4js.addLayout('json', (config) => (logEvent) => this.parseJsonOut(config, logEvent));

    this.level = process.env.LOG_STDOUT_LEVEL ? process.env.LOG_STDOUT_LEVEL : 'info';

    this.configureStdout(stdoutJson ? stdoutJson : process.env.LOG_STDOUT_JSON);
    this.logger = Log4js.getLogger(category);
    this.logger.level = this.level;
  }

  setCategory(category: string) {
    this.logger = Log4js.getLogger(category);
  }

  private configureStdout(stdoutJson?: any) {
    if (valueToBoolean(stdoutJson)) {
      Log4js.configure({
        appenders: { out: { type: 'stdout', layout: { type: 'json', separator: ',' } } },
        categories: { default: { appenders: ['out'], level: this.level } },
      });
    } else {
      Log4js.configure({
        appenders: { out: { type: 'stdout', layout: { type: 'single' } } },
        categories: { default: { appenders: ['out'], level: this.level } },
      });
    }
  }

  private parseSingleOut(config: any, logEvent: LoggingEvent) {
    let category = `${logEvent.categoryName}`;

    if (logEvent.categoryName.length <= 25) category = category + new Array(25 - category.length).join(' ');
    else if (logEvent.categoryName.length > 25) category = category.substring(0, 21) + '...';

    const message = logEvent.data.shift();
    let arg = logEvent.data.shift();
    arg = arg ? arg : '';

    let level = logEvent.level.levelStr;
    level = level + new Array(6 - level.length).join(' ');
    return chalk`${logEvent.startTime.toISOString()} {${logEvent.level.colour} ${level}} {magenta ${logEvent.pid}} --- {green ${category}:} ${message}`;
  }

  private parseJsonOut(config: any, logEvent: LoggingEvent) {
    return JSON.stringify({
      timestamp: logEvent.startTime,
      level: logEvent.level.levelStr,
      pid: logEvent.pid,
      category: logEvent.categoryName,
      message: logEvent.data.shift(),
      args: logEvent.data.shift(),
    });
  }

  trace(message: string, ...args: any[]) {
    this.logger.trace(message, args);
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug(message, args);
  }

  info(message: string, ...args: any[]) {
    this.logger.info(message, args);
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn(message, args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, args);
  }

  fatal(message: string, ...args: any[]) {
    this.logger.fatal(message, args);
  }
}
