import Bluebird from 'bluebird';
import chalk from 'chalk';
import dotenv from 'dotenv';
import figlet from 'figlet';
import { DIBootstrap, DIProvider } from './DIProvider';
import { scanBasePath } from './FilesScanner';
import { KLogger } from './KLogger';
import { InitFunctions } from './OnInit';

const log = new KLogger('@kaus:core');

const paths: Array<string> = [];
const files: Array<string> = [];

export class ApplicationBootstrap {
  constructor() {
    const others = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`];
    others.forEach((eventType) => process.on(eventType, () => log.info(`${eventType} signal received.`)));
  }

  registerPath(path: string) {
    paths.push(path);
    return this;
  }

  async start() {
    log.info('Kaus Application Bootstrap');
    console.log(chalk.yellow(figlet.textSync('@Kaus', { horizontalLayout: 'full', showHardBlanks: true })));
    console.log();
    return Bluebird.resolve(dotenv.config())
      .then(() => this.loadPaths())
      .then(() => DIBootstrap.init())
      .then(() => DIBootstrap.configure())
      .then(() => InitFunctions());
  }

  private loadPaths() {
    for (const path of paths) {
      const isModule = path.indexOf('@kaus') > -1;
      const _files = scanBasePath(isModule, path);
      _files.forEach(require);
      files.push(..._files);
    }
  }
}

export const Bootstrap = DIProvider.resolveInstance<ApplicationBootstrap>(ApplicationBootstrap);
