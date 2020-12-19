const metadata_dependency_injection: string = '__metadata:dependency_injection__';

export type LazyInject = () => Function;

export interface DependencyInjectionParam {
  key: string;
  type: any;
  lazyInject?: LazyInject;
}

function InjectDecorator(targetOrConfig?: any, key?: string) {
  if (typeof targetOrConfig === 'object' && key) {
    annotate(targetOrConfig, key);
  } else {
    return (target: any, key: string) => annotate(target, key, targetOrConfig);
  }
}

function annotate(target: any, key: string, lazyInject?: LazyInject) {
  let type = Reflect.getMetadata('design:type', target, key);
  const dependencyInjection: DependencyInjectionParam[] = Reflect.getMetadata(metadata_dependency_injection, target) || [];
  dependencyInjection.push({ key: key, type: type, lazyInject: lazyInject });
  Reflect.defineMetadata(metadata_dependency_injection, dependencyInjection, target);
}

export function hasDependencyInjection(target: any): boolean {
  return Reflect.hasMetadata(metadata_dependency_injection, target);
}

export function getDependencyInjections(target: any): DependencyInjectionParam[] {
  return Reflect.getMetadata(metadata_dependency_injection, target);
}

export function Inject(lazyInject: LazyInject): (target?: any, key?: string | symbol) => void;
export function Inject(target?: any, key?: string): void;
export function Inject(target?: any, key?: string) {
  return InjectDecorator(target, key);
}
