import { Bootstrap, DIProvider, KLogger } from '@kaus/core';
import { getHttpServer } from '@kaus/http';
import { Server } from 'socket.io';
import { getIONamespaces, hasIONamespace } from './decorators/IOSocketNamespaceDecorator';
import { resolveIOSocketController } from './IOSocketControllerResoler';

const log = new KLogger('@kaus:socketio');

let ioServer: Server;

Bootstrap.registerModule({
  bootstraper: async () => {
    log.info('init socket.io server');

    const htpServer = getHttpServer();
    ioServer = new Server(htpServer, {
      transports: ['polling', 'websocket'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    setDIProvider(ioServer);
    await resolveIOSocketController(ioServer);
  },
  shutdown: () => log.info('shutdown socket.io server'),
});

const setDIProvider = (ioServer: Server) => {
  return DIProvider.resolveDI.push((instance: any) => {
    if (!hasIONamespace(instance)) return;
    const namespaces = getIONamespaces(instance);
    return namespaces.forEach((namespace) => (instance[namespace.key] = ioServer.of(namespace.path)));
  });
};
