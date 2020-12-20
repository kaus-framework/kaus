import { getParamType, valueIsPresent } from '@kaus/core/dist/Utils';
import { ParamsExtractor, RegisterRequestHandlerParam } from '../../RequestHandlersParam';

export function Body(target: any, propertyKey: string | symbol, parameterIndex: number): void;
export function Body(validation: Function): (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
export function Body(targetOrValidationOrObject?: any, propertyKey?: string | symbol, parameterIndex?: number) {
  if (typeof targetOrValidationOrObject === 'function')
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
      const bodyType = targetOrValidationOrObject;
      return RegisterRequestHandlerParam(target, propertyKey, { index: parameterIndex, extractor: ParamsExtractor.BodyParamExtractor(bodyType) });
    };

  if (typeof targetOrValidationOrObject === 'object' && valueIsPresent(propertyKey) && valueIsPresent(parameterIndex)) {
    const target = targetOrValidationOrObject;
    const bodyType = getParamType(target, propertyKey!, parameterIndex!);
    return RegisterRequestHandlerParam(target, propertyKey!, { index: parameterIndex!, extractor: ParamsExtractor.BodyParamExtractor(bodyType) });
  }
}
