import { getParamKey, getParamType, valueIsPresent } from '@kaus/core/dist/Utils';
import { ParamsExtractor, RegisterRequestHandlerParam } from '../../RequestHandlersParam';

export function Query(): ParameterDecorator;
export function Query(queryKey: string, defaultValue?: any): ParameterDecorator;
export function Query(target: any, propertyKey: string | symbol, parameterIndex: number): void;
export function Query(targetOrQueryKeyOrObject?: any, propertyKey?: string | symbol, parameterIndex?: number) {
  if (!targetOrQueryKeyOrObject)
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
      const queryKey = getParamKey(target, propertyKey, parameterIndex);
      const paramtype = getParamType(target, propertyKey, parameterIndex);
      const defaultValue = undefined;
      return RegisterRequestHandlerParam(target, propertyKey, { index: parameterIndex, extractor: ParamsExtractor.QueryParamExtractor(queryKey, paramtype, defaultValue) });
    };

  if (typeof targetOrQueryKeyOrObject === 'string')
    return (target: any, _propertyKey: string | symbol, parameterIndex: number) => {
      const queryKey = targetOrQueryKeyOrObject;
      const paramtype = getParamType(target, _propertyKey, parameterIndex);
      const defaultValue = propertyKey;
      return RegisterRequestHandlerParam(target, _propertyKey, { index: parameterIndex, extractor: ParamsExtractor.QueryParamExtractor(queryKey, paramtype, defaultValue) });
    };

  if (typeof targetOrQueryKeyOrObject === 'object' && valueIsPresent(propertyKey) && valueIsPresent(parameterIndex)) {
    const target = targetOrQueryKeyOrObject;
    const queryKey = getParamKey(target, propertyKey!, parameterIndex!);
    const paramtype = getParamType(target, propertyKey!, parameterIndex!);
    const defaultValue = undefined;
    return RegisterRequestHandlerParam(target, propertyKey!, { index: parameterIndex!, extractor: ParamsExtractor.QueryParamExtractor(queryKey, paramtype, defaultValue) });
  }
}
