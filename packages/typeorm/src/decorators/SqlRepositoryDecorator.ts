import { DIProvider, LazyInject } from '@kaus/core';
import { valueIsPresent } from '@kaus/core/dist/Utils';

const metadata_database_repository: string = '__metadata:database_sql_repository__';

export interface DatabaseRepositoryParam {
  key: string;
  type: any;
  model?: Function;
  lazyInject?: LazyInject;
}

function SqlRepositoryDecorator(target: any, key?: string) {
  if (valueIsPresent(key) && valueIsPresent(key)) return annotate(target, key!);
  if (typeof target.prototype !== 'undefined') return (_target: any, key: string) => annotate(_target, key, target, undefined);
  if (typeof target.prototype === 'undefined') return (_target: any, key: string) => annotate(_target, key, undefined, target);
}

function annotate(target: any, key: string, model?: Function, lazyInject?: LazyInject) {
  const type = Reflect.getMetadata('design:type', target, key);
  const repositories: DatabaseRepositoryParam[] = Reflect.getMetadata(metadata_database_repository, target.constructor) || [];
  repositories.push({ key: key, type: type, model: model, lazyInject: lazyInject });
  Reflect.defineMetadata(metadata_database_repository, repositories, target.constructor);
}

export function hasSqlRepository(instance: any): boolean {
  instance = DIProvider.resolveInstance(instance);
  return Reflect.hasMetadata(metadata_database_repository, instance.constructor);
}

export function getSqlRepositories(instance: any): DatabaseRepositoryParam[] {
  instance = DIProvider.resolveInstance(instance);
  return Reflect.getMetadata(metadata_database_repository, instance.constructor);
}

export function SqlRepository(lazyInject: LazyInject): (target: any, key: string) => void;
export function SqlRepository(model: Function): (target: any, key: string) => void;
export function SqlRepository(target: any, key: string): void;
export function SqlRepository(target: any, key?: string) {
  return SqlRepositoryDecorator(target, key);
}
