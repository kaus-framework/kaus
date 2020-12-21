import { Bootstrap, DIProvider, KLogger } from '@kaus/core';
import { paths } from '@kaus/core/dist/ApplicationBootstrap';
import { getClassName, isGenericObject } from '@kaus/core/dist/Utils';
import Bluebird from 'bluebird';
import chalk from 'chalk';
import { Connection, getConnectionManager, getConnectionOptions } from 'typeorm';
import { getSqlRepositories, hasSqlRepository } from './decorators';

const log: KLogger = new KLogger('@kaus:typeorm');

let connection: Connection;

Bootstrap.registerModule({
  bootstraper: async () => {
    if (!process.env.TYPEORM_CONNECTION) return;
    const connectionOptions: any = Object.assign({}, await getConnectionOptions());

    const dirs = paths.map((path) => `${path}/**/{*.js,*.ts}`);

    connectionOptions.entities = dirs;
    connectionOptions.subscribers = dirs;

    connection = getConnectionManager().create(connectionOptions);

    return Bluebird.resolve(connection.connect())
      .tap((connection: Connection) => setDIProvider(connection))
      .tap((connection: Connection) => connection.subscribers.forEach((subscriber: any) => DIProvider.addToInstanceCollector(subscriber)))
      .then(() => log.info(`typeorm: database [${process.env.TYPEORM_CONNECTION}] connection has been established successfully.`))
      .tapCatch((err: Error) => {
        log.fatal(`typeorm: unable to connect to the database[${process.env.TYPEORM_CONNECTION}]`);
        log.fatal(err.message);
      });
  },
  shutdown: () => (connection ? connection.close().then(() => log.info(`typeorm: database [${process.env.TYPEORM_CONNECTION}] connection shutdown`)) : {}),
});

const setDIProvider = (connection: Connection) => {
  return DIProvider.resolveDI.push((instance: any) => {
    if (!hasSqlRepository(instance)) return;
    const repositorParams = getSqlRepositories(instance);
    return repositorParams.forEach(async (databaseRepository) => {
      const key = databaseRepository.key;
      const type = databaseRepository.lazyInject ? databaseRepository.lazyInject() : databaseRepository.model ? databaseRepository.model : databaseRepository.type;
      if (isGenericObject(type)) {
        const className = getClassName(instance);
        log.warn(
          `generic object detected in class: ${chalk.blue(className)} -> @${chalk.green(key)}, please use ${chalk.yellow('@SqlRepository(Entity)')} or ${chalk.yellow(
            '@SqlRepository(() => CustomRepository)',
          )}`,
        );
        return;
      }

      if (databaseRepository.model) instance[key] = connection.getRepository(type);
      else instance[key] = DIProvider.getInstance(type) || DIProvider.addToInstanceCollector<any>(connection.getCustomRepository(type));
    });
  });
};
