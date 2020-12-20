import { DIProvider } from '@kaus/core';
import Bluebird from 'bluebird';
import { Server, Socket } from 'socket.io';
import { getIOSocketControllerNamespace, isIOSocketController } from './decorators/IOSocketControllerDecorator';
import { getIOSocketEventHandler } from './decorators/IOSocketOnEventDecorator';

export async function resolveIOSocketController(ioServer: Server) {
  return Bluebird.resolve(Object.values(DIProvider.instanceCollector))
    .filter((instance: any) => isIOSocketController(instance))
    .each((ioSocketController: any) => {
      const path: string = getIOSocketControllerNamespace(ioSocketController);
      const socketEventHandlers = getIOSocketEventHandler(ioSocketController);
      const handlers = async (socket: Socket) =>
        socketEventHandlers.forEach(async (eventHandler) => {
          if (eventHandler.event === 'connection') return ioSocketController[eventHandler.propertyKey](socket);
          return socket.on(eventHandler.event, async (...data) => ioSocketController[eventHandler.propertyKey](socket, ...data));
        });
      ioServer.of(path).on('connection', async (socket: Socket) => handlers(socket));
    });
}
