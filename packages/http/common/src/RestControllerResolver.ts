import { DIProvider } from '@kaus/core';
import Bluebird from 'bluebird';
import { getRequestHandlerMappings, getRestControllerPath, isRestController, RequestHandlerMapping } from './decorators';
import { getRequestHandlerParams, RequestHandlerParam } from './RequestHandlersParam';

export type RestControllerResolver = (restControllerPath: string, requestHandler: RequestHandlerMapping, handler: any) => any;
export type RequestHandlerResolver = (restController: any, requestHandler: RequestHandlerMapping, requestParams: RequestHandlerParam[]) => any;
export type ResolverCallback = () => void;
export const Resolver = {
  RestControllerResolver: ((_restControllerPath: string, _requestHandler: RequestHandlerMapping, _handler: any) => {
    throw new Error('Method RestControllerResolver not implemented.');
  }) as RestControllerResolver,
  RequestHandlerResolver: ((_restController: any, _requestHandler: RequestHandlerMapping, _requestParams: RequestHandlerParam[]) => {
    throw new Error('Method RequestHandlerResolver not implemented.');
  }) as RequestHandlerResolver,
  Callback: (() => {}) as ResolverCallback,
};

export async function resolveRestController() {
  return Bluebird.resolve(Object.values(DIProvider.instanceCollector))
    .filter((instance: any) => isRestController(instance))
    .each((restController: any) => {
      const restControllerPath: string = getRestControllerPath(restController);
      return Bluebird.resolve(getRequestHandlerMappings(restController))
        .then((requestHandlers: RequestHandlerMapping[]) => requestHandlers.sort((a: RequestHandlerMapping, b: RequestHandlerMapping) => b.path.length - a.path.length))
        .each(async (requestHandler) => {
          const requestParams = getRequestHandlerParams(restController, requestHandler.propertyKey).sort((s0, s1) => s0.index - s1.index);
          const handler = await Resolver.RequestHandlerResolver(restController, requestHandler, requestParams);
          return Resolver.RestControllerResolver(restControllerPath, requestHandler, handler);
        });
    })
    .then(() => Resolver.Callback());
}
