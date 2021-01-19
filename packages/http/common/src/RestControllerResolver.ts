import { DIProvider } from '@kaus/core';
import Bluebird from 'bluebird';
import { getRequestHandlerMappings, getRestControllerPath, isRestController, TypeRequestMethod } from './decorators';
import { getRequestHandlerParams } from './RequestHandlersParam';

export type RequestHandlerResolver = (controllerHanlder: (...params: any) => any, paramsExtractor: ((...params: any) => any)[]) => any;
export type RestControllerResolver = (method: TypeRequestMethod, controllerPath: string, path: string, handler: any) => any;
export type ResolverCallback = () => void;

export const Resolver = {
  RequestHandlerResolver: ((_controllerHanlder: any, _requestParams: any) => {
    throw new Error('Method RequestHandlerResolver not implemented.');
  }) as RequestHandlerResolver,
  RestControllerResolver: ((_method: TypeRequestMethod, _controllerPath: string, _path: string, _handler: any) => {
    throw new Error('Method RestControllerResolver not implemented.');
  }) as RestControllerResolver,
  Callback: (() => {}) as ResolverCallback,
};

export async function resolveRestController() {
  return Bluebird.resolve(Object.values(DIProvider.instanceCollector))
    .filter((instance: any) => isRestController(instance))
    .each((restController: any) => {
      const restControllerPath: string = getRestControllerPath(restController);
      return Bluebird.resolve(getRequestHandlerMappings(restController)).each(async (requestHandler) => {
        const paramsExtractors = getRequestHandlerParams(restController, requestHandler.propertyKey).map((handler) => (...params: any) => handler.extractor(...params));
        const handler = await Resolver.RequestHandlerResolver((...params: any) => restController[requestHandler.propertyKey](...params), paramsExtractors);
        return Resolver.RestControllerResolver(requestHandler.method, restControllerPath, requestHandler.path, handler);
      });
    })
    .then(() => Resolver.Callback());
}
