import { Bootstrap, KLogger } from '@kaus/core';
import http, { RequestListener } from 'http';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import { resolveRestController } from './RestControllerResolver';

let os = require('os');
let httpServer: http.Server;
let httpTerminator: HttpTerminator;

const log: KLogger = new KLogger('@kaus:http');

export const createHttpServer = (requestListener?: RequestListener): http.Server => {
  if (typeof httpServer !== 'undefined') throw new Error('httpServer has already been create');
  httpServer = http.createServer(requestListener);
  return httpServer;
};

export const getHttpServer = (): http.Server => {
  if (typeof httpServer !== 'undefined') return httpServer;
  else {
    return createHttpServer();
  }
};

Bootstrap.registerModule({
  index: Number.MAX_VALUE,
  bootstraper: async () => {
    await resolveRestController();
    httpTerminator = createHttpTerminator({ server: getHttpServer() });
    const port: number = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;
    if (process.env.HTTP_SERVER_TIMEOUT) {
      const timeout = Number.parseInt(process.env.HTTP_SERVER_TIMEOUT);
      httpServer.keepAliveTimeout = timeout;
      httpServer.headersTimeout = timeout;
      httpServer.timeout = timeout;
      httpServer.setTimeout(timeout);
    }
    httpServer.listen(port, '0.0.0.0', () => {
      log.info(`http server running at http://${os.hostname()}:${port}`);
    });
  },
  shutdown: async () => await httpTerminator.terminate().then(() => log.info('http server closed.')),
});
