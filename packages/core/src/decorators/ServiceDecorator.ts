import { DIProvider } from '../DIProvider';

function ServiceDecorator(config: any) {
  if (typeof config === 'function') {
    return annotate(config);
  } else {
    return (_target: Function) => annotate(_target, config);
  }
}

function annotate(target: any, options: any = {}) {
  DIProvider.clazz.push(target);
}

export function Service(_target: Function): void;
export function Service(): ClassDecorator;
export function Service(targetOrOption?: any) {
  return ServiceDecorator(targetOrOption);
}
