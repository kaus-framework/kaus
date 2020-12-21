import Bluebird from 'bluebird';
import chalk from 'chalk';
import dotenv from 'dotenv';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { DIBootstrap, DIProvider } from './DIProvider';
import { scanBasePath } from './FilesScanner';
import { KLogger } from './KLogger';
import { InitFunctions } from './OnInit';

const log = new KLogger('@kaus:core');

type KausModule = {
  index?: number;
  bootstraper: () => void;
  shutdown?: () => void;
};

export const paths: Array<string> = [];
export const modulePaths: Array<string> = [];
const files: Array<string> = [];
const bootstrapModules: Array<KausModule> = [];

export class ApplicationBootstrap {
  constructor() {
    this.registerModules();
  }

  private registerModules() {
    const basepath = path.join(process.cwd(), 'node_modules', '@kaus');
    fs.readdir(path.join(process.cwd(), 'node_modules', '@kaus'), (e, kausModules) => {
      kausModules.forEach((kausModule) => {
        const kausModulePath = path.join(basepath, kausModule);
        const kausPackageConfig: any = require(path.join(kausModulePath, 'package.json')).kaus;
        if (kausPackageConfig.registerPath) modulePaths.push(path.join(kausModulePath, kausPackageConfig.registerPath));
      });
    });
  }

  registerPath(path: string, module: boolean = false) {
    module ? modulePaths.push(path) : paths.push(path);
    return this;
  }

  registerModule(bootstraper: KausModule) {
    if (bootstraper.index === undefined) bootstraper.index = 0;
    if (bootstraper.shutdown === undefined) bootstraper.shutdown = () => {};
    bootstrapModules.push(bootstraper);
  }

  async start() {
    log.info('Kaus Application Bootstrap');
    console.log(chalk.yellow(figlet.textSync('@Kaus', { horizontalLayout: 'full', showHardBlanks: true })));
    console.log();

    await Bluebird.resolve(bootstrapModules)
      .then((modules) => modules.sort((a, b) => a.index! - b.index!))
      .then((modules) => {
        const eventsType = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`];
        let stopSenial = false;
        return Bluebird.resolve(eventsType).map(async (eventType) =>
          process.on(eventType, async () => {
            if (!stopSenial) {
              stopSenial = true;
              console.log();
              log.info(`${eventType.toUpperCase()} signal received.`);
              return await Bluebird.resolve(modules)
                .each((module) => module.shutdown!())
                .then(() => {
                  log.info('Kaus Application Shutdown');
                });
            }
          }),
        );
      });

    return Bluebird.resolve(dotenv.config())
      .then(() => this.loadPaths())
      .then(() => DIBootstrap.resolveInstances())
      .then(async () =>
        Bluebird.resolve(bootstrapModules)
          .then((modules) => modules.sort((a, b) => a.index! - b.index!))
          .each((modules) => modules.bootstraper()),
      )
      .then(() => DIBootstrap.configure())
      .then(() => InitFunctions());
  }

  private loadPaths() {
    for (const path of modulePaths) {
      const _files = scanBasePath(true, path);
      _files.forEach(require);
      files.push(..._files);
    }

    for (const path of paths) {
      const _files = scanBasePath(false, path);
      _files.forEach(require);
      files.push(..._files);
    }

    for (const path of modulePaths) {
      const _files = scanBasePath(true, path);
      _files.forEach(require);
      files.push(..._files);
    }
  }
}

export const Bootstrap = DIProvider.resolveInstance<ApplicationBootstrap>(ApplicationBootstrap);
