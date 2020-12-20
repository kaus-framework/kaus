import { getParamKey, getParamType, valueIsPresent } from '@kaus/core/dist/Utils';
import { ParamsExtractor, RegisterRequestHandlerParam } from '../../RequestHandlersParam';

export function Header(): ParameterDecorator;
export function Header(queryKey: string, defaultValue?: any): ParameterDecorator;
export function Header(target: any, propertyKey: string | symbol, parameterIndex: number): void;
export function Header(targetOrHeaderKeyOrObject?: any, propertyKey?: string | symbol, parameterIndex?: number) {
  if (!targetOrHeaderKeyOrObject)
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
      const headerKey = getParamKey(target, propertyKey, parameterIndex);
      const paramtype = getParamType(target, propertyKey, parameterIndex);
      const defaultValue = undefined;
      return RegisterRequestHandlerParam(target, propertyKey, { index: parameterIndex, extractor: ParamsExtractor.HeaderParamExtractor(headerKey, paramtype, defaultValue) });
    };

  if (typeof targetOrHeaderKeyOrObject === 'string')
    return (target: any, _propertyKey: string | symbol, parameterIndex: number) => {
      const headerKey = targetOrHeaderKeyOrObject;
      const paramtype = getParamType(target, _propertyKey, parameterIndex);
      const defaultValue = propertyKey;
      return RegisterRequestHandlerParam(target, _propertyKey, { index: parameterIndex, extractor: ParamsExtractor.HeaderParamExtractor(headerKey, paramtype, defaultValue) });
    };

  if (typeof targetOrHeaderKeyOrObject === 'object' && valueIsPresent(propertyKey) && valueIsPresent(parameterIndex)) {
    const target = targetOrHeaderKeyOrObject;
    const headerKey = getParamKey(target, propertyKey!, parameterIndex!);
    const paramtype = getParamType(target, propertyKey!, parameterIndex!);
    const defaultValue = undefined;
    return RegisterRequestHandlerParam(target, propertyKey!, { index: parameterIndex!, extractor: ParamsExtractor.HeaderParamExtractor(headerKey, paramtype, defaultValue) });
  }
}
