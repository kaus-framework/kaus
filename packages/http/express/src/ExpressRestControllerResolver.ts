import { RequestHandlerMapping } from '@kaus/http/dist/decorators';
import { RequestHandlerParam } from '@kaus/http/dist/RequestHandlersParam';
import { Resolver } from '@kaus/http/dist/RestControllerResolver';
import Bluebird from 'bluebird';
import { NextFunction, Request, Response, Router } from 'express';
import { app } from './Bootstrap';

const collector: { [key: string]: Router } = {};

Resolver.RestControllerResolver = async (restControllerPath: string, requestHandler: RequestHandlerMapping, handler: any) => {
  if (!collector[restControllerPath]) collector[restControllerPath] = Router();
  const router = collector[restControllerPath];
  router[requestHandler.method](requestHandler.path, handler);
};

Resolver.RequestHandlerResolver = async (restController: any, requestHandler: RequestHandlerMapping, requestParams: RequestHandlerParam[]) => {
  return async (req: Request, res: Response, next: NextFunction) =>
    Bluebird.resolve(requestParams)
      .map((requestParam: RequestHandlerParam) => requestParam.extractor(req, res))
      .then((params: any[]) => restController[requestHandler.propertyKey](...params))
      .then((response) => {
        if (res.headersSent) return;
        if (typeof response === 'undefined') return res.status(204).json();
        const status = typeof response.httpStatus === 'number' ? response.httpStatus : 200;
        delete response.httpStatus;
        return res.status(status).json({ data: response });
      })
      .then(() => next())
      .catch(next);
};

Resolver.Callback = async () => {
  Object.keys(collector).forEach((restControllerPath) => app.use(restControllerPath, collector[restControllerPath]));
};
