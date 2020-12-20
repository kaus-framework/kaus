import { ParamsExtractor } from '@kaus/http/dist/RequestHandlersParam';
import { Request, Response } from 'express';

ParamsExtractor.BodyParamExtractor = (bodyType: any) => (req: Request, _res: Response) => req.body;
ParamsExtractor.HeaderParamExtractor = (headerKey: string, paramtype, defaultValue) => (req: Request, _res: Response) => req.headers[headerKey.toLowerCase()];
ParamsExtractor.IPParamExtractor = () => (req: Request, _res: Response) => req.ip;
ParamsExtractor.QueryParamExtractor = (queryKey, paramtype, defaultValue) => (req: Request, _res: Response) => req.query[queryKey.toLowerCase()];
ParamsExtractor.RequestParamExtractor = () => (req: Request, _res: Response) => req;
ParamsExtractor.ResponseParamExtractor = () => (_req: Request, res: Response) => res;
ParamsExtractor.RouterParamExtractor = (paramKey, paramType) => (req: Request, _res: Response) => req.params[paramKey];
