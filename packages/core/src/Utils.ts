import fs from 'fs';
import path from 'path';

export const isTypeScript = typeof process[Symbol.for('ts-node.register.instance')] === 'object';

export const isJavaScript = !isTypeScript;

export const isBuild = process.env.NODE_ENV === 'build';

export const isTest = process.env.NODE_ENV === 'test';

export const gc = () => (global.gc ? global.gc() : {});

export const isGenericObject = (value: any) => {
  return getClassName(value) === 'Object';
};

export const valueToBoolean = (value?: any, defult = false): boolean => {
  if (typeof value === 'string') {
    value = value.toLowerCase();
    if (value.length < 1) return defult;
  }
  return value === undefined ? defult : value === true || value === 'yes' || value === 'true' || value === 1 || value === '1';
};

export const valueIsPresent = (value?: any): boolean => {
  return value !== undefined || typeof value !== 'undefined';
};

export const getClassName = (clazz: any): string => {
  if (typeof clazz === 'function') return clazz.name;
  if (typeof clazz === 'object') return clazz.constructor.name;
  else return 'unknown';
};

export const createClass = <T = any>(target: any, values: any): T => {
  const constructor = typeof target === 'function' ? target : target.constructor;
  return Object.assign(new constructor(), values) as T;
};

export const validatePath = (path?: string): string => {
  path = path ? (path.endsWith('/') ? path.substring(0, path.length - 1) : path) : '/';
  path = !path.startsWith('/') ? '/' + path : path;
  path = path.replace(/(\/)+/g, '/');
  return path.toLowerCase();
};

export function convertColonPathParams(path: string) {
  if (!path || typeof path !== 'string') return path;
  const normalised = path.replace(/:([^\/]+)/g, '{$1}');
  return normalised;
}

export const loadJson = (json?: string) => {
  if (!json) return;
  const configRaw = fs.readFileSync(json);
  return JSON.parse(configRaw.toString('utf-8'));
};

export function camelCaseTo(cammelCase: string, add: string, lowerCase = false): string {
  let value = cammelCase;
  if (add.length > 0) value = value.replace(/([A-Z])/g, `${add}$1`).trim();
  if (value.startsWith(add)) value = value.substring(add.length);
  if (lowerCase) value = value.toLowerCase();
  return value;
}

export function findFile(dir: any, fileName: string): string | undefined {
  const files = fs.readdirSync(dir);
  for (const file in files) {
    const name = dir + path.sep + files[file];
    if (fs.statSync(name).isDirectory()) {
      if (name.indexOf('node_modules') === -1) {
        const finded = findFile(name, fileName);
        if (finded !== undefined) return finded;
      }
    } else {
      if (name.endsWith(fileName)) return name;
    }
  }
  return undefined;
}

export const getParamKey = (target: any, propertyKey: string | symbol, parameterIndex: number): string => {
  return target[propertyKey!]
    .toString()
    .match(/\(([^)]+)\)/)[1]
    .split(',')
    [parameterIndex!].trim();
};

export const getParamType = (target: any, propertyKey: string | symbol, parameterIndex: number): any => {
  return Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
};
