import { valueIsPresent } from '@kaus/core/dist/Utils';
import { ParamsExtractor, RegisterRequestHandlerParam } from '../../RequestHandlersParam';

export function Res(): ParameterDecorator;
export function Res(target: any, propertyKey: string | symbol, parameterIndex: number): void;
export function Res(targetOrVoid?: any, propertyKey?: string | symbol, parameterIndex?: number) {
  if (!targetOrVoid)
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
      return RegisterRequestHandlerParam(target, propertyKey, { index: parameterIndex, extractor: ParamsExtractor.ResponseParamExtractor });
    };

  if (typeof targetOrVoid === 'object' && valueIsPresent(propertyKey) && valueIsPresent(parameterIndex)) {
    const target = targetOrVoid;
    return RegisterRequestHandlerParam(target, propertyKey!, { index: parameterIndex!, extractor: ParamsExtractor.ResponseParamExtractor });
  }
}
