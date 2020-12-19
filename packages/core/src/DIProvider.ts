import chalk from 'chalk';
import { getDependencyInjections, hasDependencyInjection } from './decorators';
import { KLogger } from './KLogger';
import { onInit } from './OnInit';
import { getClassName, isGenericObject } from './Utils';

const log: KLogger = new KLogger('@kaus:DIProvider');

type InstanceCollector = { [key: string]: any };

export const DIProvider = {
  instanceCollector: {} as InstanceCollector,
  clazz: [] as Function[],
  resolveDI: new Array<(instance: any) => void>(),
  resolveInstance: <T>(target: any): T => target as T,
  addToInstanceCollector: <T>(target: any, key?: string): T => target as T,
};

export const DIBootstrap = {
  init: () => DIProvider.clazz.forEach(DIProvider.resolveInstance),
  resolveDependencyInjection: (instance: any) => DIProvider.resolveDI.forEach((resolveDI) => resolveDI(instance)),
  configure: () => Object.values(DIProvider.instanceCollector).forEach(DIBootstrap.resolveDependencyInjection),
};

DIProvider.addToInstanceCollector = (instance: any, key?: string) => {
  key = key ? key : getClassName(instance);
  if (typeof instance.onInit === 'function') onInit.push(instance);
  DIProvider.instanceCollector[key] = instance;
  return instance;
};

DIProvider.resolveInstance = <T = any>(target: any): T => {
  if (target === undefined) return (undefined as unknown) as T;
  if (typeof target === 'string') return DIProvider.instanceCollector[target] as T;

  const key = getClassName(target);
  if (DIProvider.instanceCollector[key]) return DIProvider.instanceCollector[key];

  const constructor = typeof target === 'function' ? target : target.constructor;
  const paramtypes = Reflect.getMetadata('design:paramtypes', constructor) || [];
  const injections = paramtypes.map((paramtype: any) => {
    if (!paramtype) throw new TypeError(`circular dependency in '${target.prototype.constructor.name}'`);
    return DIProvider.resolveInstance<any>(paramtype);
  });
  const instance = new constructor(...injections);
  return DIProvider.addToInstanceCollector(instance, key) as T;
};

DIProvider.resolveDI.push((instance: any) => {
  const className = getClassName(instance);
  if (hasDependencyInjection(instance)) {
    const dis = getDependencyInjections(instance);
    dis.forEach((di: any) => {
      const type = di.lazyInject ? di.lazyInject() : di.type;
      if (type === undefined || isGenericObject(type)) {
        log.warn(`generic object detected in class: ${chalk.blue(className)} -> @${chalk.green(di.key)}, please use ${chalk.yellow('@Inject(() => LazyInject)')}`);
        return;
      }
      instance[di.key] = DIProvider.resolveInstance(type);
    });
  }
  instance['log'] = new KLogger(className, process.env.LOG_STDOUT_JSON);
});
