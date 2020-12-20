const metadata_request_params: string = '__metadata:request_params__';

export type RequestHandlerParamExtractor = (...params: any) => any;

export interface RequestHandlerParam {
  readonly type?: string;
  readonly name?: string;
  readonly index: number;
  readonly extractor: RequestHandlerParamExtractor;
}

export const ParamsExtractor = {
  BodyParamExtractor: (() => {
    throw new Error('Method BodyParamExtractor not implemented.');
  }) as RequestHandlerParamExtractor,
  HeaderParamExtractor: (() => {
    throw new Error('Method HeaderParamExtractor not implemented.');
  }) as RequestHandlerParamExtractor,
  IPParamExtractor: (() => {
    throw new Error('Method IPParamExtractor not implemented.');
  }) as RequestHandlerParamExtractor,
  QueryParamExtractor: (() => {
    throw new Error('Method QueryParamExtractor not implemented.');
  }) as RequestHandlerParamExtractor,
  RequestParamExtractor: (() => {
    throw new Error('Method RequestParamExtractor not implemented.');
  }) as RequestHandlerParamExtractor,
  ResponseParamExtractor: (() => {
    throw new Error('Method ResponseParamExtractor not implemented.');
  }) as RequestHandlerParamExtractor,
  RouterParamExtractor: (() => {
    throw new Error('Method RouterParamExtractor not implemented.');
  }) as RequestHandlerParamExtractor,
};

export function RegisterRequestHandlerParam(bean: any, propertyKey: string | symbol, requestParam: RequestHandlerParam) {
  const requestParams: RequestHandlerParam[] = Reflect.getMetadata(metadata_request_params, bean, propertyKey) || [];
  requestParams.push(requestParam);
  Reflect.defineMetadata(metadata_request_params, requestParams, bean, propertyKey);
}

export function getRequestHandlerParams(bean: any, propertyKey: string | symbol): RequestHandlerParam[] {
  return Reflect.getMetadata(metadata_request_params, bean, propertyKey) || [];
}
