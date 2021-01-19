import { TypeRequestMethod } from '@kaus/http';
import { Resolver } from '@kaus/http/dist/RestControllerResolver';
import Bluebird from 'bluebird';
import { NextFunction, Request, Response, Router } from 'express';
import { app } from './Bootstrap';

const collector: { [key: string]: Router } = {};

Resolver.RequestHandlerResolver = async (requestHandler: (...params: any) => any, paramsExtractor: ((...params: any) => any)[]) => {
  return async (req: Request, res: Response, next: NextFunction) =>
    Bluebird.resolve(paramsExtractor)
      .map((extractor) => extractor(req, res))
      .then((params: any[]) => requestHandler(...params))
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

Resolver.RestControllerResolver = async (method: TypeRequestMethod, controllerPath: string, path: string, handler: any) => {
  if (!collector[controllerPath]) collector[controllerPath] = Router();
  const router = collector[controllerPath];
  router[method](path, handler);
};

Resolver.Callback = async () => {
  Object.keys(collector).forEach((restControllerPath) => app.use(restControllerPath, collector[restControllerPath]));
};
