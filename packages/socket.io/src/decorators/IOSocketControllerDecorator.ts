import { DIProvider } from '@kaus/core';
import { validatePath } from '@kaus/core/dist/Utils';

const metadata_socket_namespace: string = '__metadata:io_socket_namespace__';

export function IOSocketControllerDecorator(config?: any) {
  if (typeof config === 'function') {
    annotate(config);
  } else {
    return (_target: Function) => annotate(_target, config);
  }
}

function annotate(target: Function, path?: string) {
  const defaultPath = validatePath('/');
  const usePath: string = typeof path === 'undefined' ? defaultPath : validatePath(path);
  Reflect.defineMetadata(metadata_socket_namespace, usePath, target);
  DIProvider.clazz.push(target);
}

export const getIOSocketControllerNamespace = (instance: any): string => {
  return Reflect.getMetadata(metadata_socket_namespace, instance.constructor) as string;
};

export const isIOSocketController = (instance: any): boolean => {
  instance = DIProvider.resolveInstance<any>(instance);
  return Reflect.hasMetadata(metadata_socket_namespace, instance.constructor);
};

export function IOSocketController(_target: Function): void;
export function IOSocketController(): (_target: Function) => void;
export function IOSocketController(namespace: string): (_target: Function) => void;
export function IOSocketController(config?: Function | any) {
  return IOSocketControllerDecorator(config);
}
