import { DIProvider } from '@kaus/core';
import { getClassName, validatePath } from '@kaus/core/dist/Utils';
import chalk from 'chalk';

const metadata_request_mapping: string = '__metadata:request_mapping__';

/**
 * declarations
 */
export type TypeRequestMethod = 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete';
export const ArrayMetods = ['get', 'head', 'post', 'put', 'patch', 'delete'];

export type RequestHandlerMapping = {
  readonly method: TypeRequestMethod;
  readonly path: string;
  readonly propertyKey: string;
};

function RequestMappingFactory(method: TypeRequestMethod, targetOrPath: any | string, propertyKey?: string, descriptor?: PropertyDescriptor) {
  const defaultPath = validatePath();
  if (typeof targetOrPath === 'object') {
    return annotate(method, defaultPath, targetOrPath, propertyKey!, descriptor);
  } else {
    const usePath = typeof targetOrPath === undefined ? defaultPath : validatePath(targetOrPath);
    return (_target: any, _propertyKey: string, _descriptor?: PropertyDescriptor) => annotate(method, usePath, _target, _propertyKey, _descriptor);
  }
}

function annotate(method: TypeRequestMethod, path: string, _target: any, propertyKey: string, _descriptor?: PropertyDescriptor) {
  if (Reflect.hasMetadata(metadata_request_mapping, _target.constructor, propertyKey)) {
    const className = getClassName(_target);
    throw new TypeError(`Only one request mapping decorator in: ${chalk.blue(className)} -> @${chalk.green(location)}`);
  }

  const requestHandlers: RequestHandlerMapping[] = Reflect.getMetadata(metadata_request_mapping, _target.constructor) || [];

  const request: RequestHandlerMapping = {
    method: method,
    path: path,
    propertyKey: propertyKey,
  };
  requestHandlers.push(request);
  Reflect.defineMetadata(metadata_request_mapping, true, _target.constructor, propertyKey);
  Reflect.defineMetadata(metadata_request_mapping, requestHandlers, _target.constructor);
}

export function getRequestHandlerMappings(instance: any): RequestHandlerMapping[] {
  return (Reflect.getMetadata(metadata_request_mapping, instance.constructor) || []).sort((a: RequestHandlerMapping, b: RequestHandlerMapping) => b.path.length - a.path.length);
}

export function getRequestHandlerMapping(instance: any, propertyKey: string): RequestHandlerMapping {
  if (typeof instance === 'string') instance = DIProvider.resolveInstance<any>(instance);
  return Reflect.getMetadata(metadata_request_mapping, instance.constructor, propertyKey);
}

export function Get(path: string): (_target: any, propertyKey: string, _descriptor?: PropertyDescriptor) => void;
export function Get(_target: any, propertyKey: string, _descriptor?: PropertyDescriptor): void;
export function Get(targetOrPath?: any | string, propertyKey?: string, _descriptor?: PropertyDescriptor) {
  return RequestMappingFactory('get', targetOrPath!, propertyKey!, _descriptor);
}

export function Head(path?: string): (_target: any, propertyKey: string, _descriptor?: PropertyDescriptor) => void;
export function Head(_target: any, propertyKey: string, _descriptor?: PropertyDescriptor): void;
export function Head(targetOrPath?: any | string, propertyKey?: string, _descriptor?: PropertyDescriptor) {
  return RequestMappingFactory('head', targetOrPath!, propertyKey!, _descriptor);
}

export function Post(path?: string): (_target: any, propertyKey: string, _descriptor?: PropertyDescriptor) => void;
export function Post(_target: any, propertyKey: string, _descriptor?: PropertyDescriptor): void;
export function Post(targetOrPath?: any | string, propertyKey?: string, _descriptor?: PropertyDescriptor) {
  return RequestMappingFactory('post', targetOrPath!, propertyKey!, _descriptor);
}

export function Put(path?: string): (_target: any, propertyKey: string, _descriptor?: PropertyDescriptor) => void;
export function Put(_target: any, propertyKey: string, _descriptor?: PropertyDescriptor): void;
export function Put(targetOrPath?: any | string, propertyKey?: string, _descriptor?: PropertyDescriptor) {
  return RequestMappingFactory('put', targetOrPath!, propertyKey!, _descriptor);
}

export function Patch(path?: string): (_target: any, propertyKey: string, _descriptor?: PropertyDescriptor) => void;
export function Patch(_target: any, propertyKey: string, _descriptor?: PropertyDescriptor): void;
export function Patch(targetOrPath?: any | string, propertyKey?: string, _descriptor?: PropertyDescriptor) {
  return RequestMappingFactory('patch', targetOrPath!, propertyKey!, _descriptor);
}

export function Delete(path?: string): (_target: any, propertyKey: string, _descriptor?: PropertyDescriptor) => void;
export function Delete(_target: any, propertyKey: string, _descriptor?: PropertyDescriptor): void;
export function Delete(targetOrPath?: any | string, propertyKey?: string, _descriptor?: PropertyDescriptor) {
  return RequestMappingFactory('delete', targetOrPath!, propertyKey!, _descriptor);
}
