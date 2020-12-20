import { getParamKey, getParamType, valueIsPresent } from '@kaus/core/dist/Utils';
import { ParamsExtractor, RegisterRequestHandlerParam } from '../../RequestHandlersParam';

export function Param(): ParameterDecorator;
export function Param(paramKey: string): ParameterDecorator;
export function Param(target: any, propertyKey: string | symbol, parameterIndex: number): void;
export function Param(targetOrParamKeyOrObject?: any, propertyKey?: string | symbol, parameterIndex?: number) {
  if (!targetOrParamKeyOrObject)
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
      const paramKey = getParamKey(target, propertyKey, parameterIndex);
      const paramtype = getParamType(target, propertyKey, parameterIndex);
      return RegisterRequestHandlerParam(target, propertyKey, { index: parameterIndex, extractor: ParamsExtractor.RouterParamExtractor(paramKey, paramtype) });
    };

  if (typeof targetOrParamKeyOrObject === 'string')
    return (target: any, _propertyKey: string | symbol, parameterIndex: number) => {
      const paramKey = targetOrParamKeyOrObject;
      const paramtype = getParamType(target, _propertyKey, parameterIndex);
      return RegisterRequestHandlerParam(target, _propertyKey, { index: parameterIndex, extractor: ParamsExtractor.RouterParamExtractor(paramKey, paramtype) });
    };

  if (typeof targetOrParamKeyOrObject === 'object' && valueIsPresent(propertyKey) && valueIsPresent(parameterIndex)) {
    const target = targetOrParamKeyOrObject;
    const paramKey = getParamKey(target, propertyKey!, parameterIndex!);
    const paramtype = getParamType(target, propertyKey!, parameterIndex!);
    return RegisterRequestHandlerParam(target, propertyKey!, { index: parameterIndex!, extractor: ParamsExtractor.RouterParamExtractor(paramKey, paramtype) });
  }
}
