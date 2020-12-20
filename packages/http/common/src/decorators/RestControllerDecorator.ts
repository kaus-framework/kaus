import { DIProvider } from '@kaus/core';
import { validatePath } from '@kaus/core/dist/Utils';

const metadata_rest_controller_path: string = '__metadata:rest_controller_path__';

function RestControllerDecorator(config?: any) {
  if (typeof config === 'function') {
    annotate(config);
  } else {
    return (_target: Function) => annotate(_target, config);
  }
}

function annotate(_target: Function, path?: string) {
  const defaultPath = validatePath();
  const usePath: string = typeof path === 'undefined' ? defaultPath : validatePath(path);
  Reflect.defineMetadata(metadata_rest_controller_path, usePath, _target);
  DIProvider.clazz.push(_target);
}

export const getRestControllerPath = (instance: any): string => {
  instance = DIProvider.resolveInstance<any>(instance);
  return Reflect.getMetadata(metadata_rest_controller_path, instance.constructor) as string;
};

export const isRestController = (instance: any): boolean => {
  instance = DIProvider.resolveInstance<any>(instance);
  return Reflect.hasMetadata(metadata_rest_controller_path, instance.constructor);
};

export function RestController(_target: Function): void;
export function RestController(): (_target: Function) => void;
export function RestController(path: string): (_target: Function) => void;
export function RestController(config?: Function | any) {
  return RestControllerDecorator(config);
}
