import { KLogger } from '@kaus/core';
import { IONamespace, IOSocketController, IOSocketOnConnection, IOSocketOnDisconnect, IOSocketOnEvent, Namespace, Socket } from '@kaus/socket.io';

@IOSocketController('/chat')
export class IOSocketControllerOne {
  private log: KLogger;

  @IONamespace('/chat')
  private namespace: Namespace;

  @IOSocketOnConnection
  async onConnection(socket: Socket) {
    this.log.info(`onConnection: ${socket.id}`);
  }

  @IOSocketOnEvent('chat-message')
  async onMessage(socket: Socket, data: any) {
    this.log.info(`onMessage: ${socket.id}, ${JSON.stringify(data)}`);
    this.namespace.emit('new-message', data);
  }

  @IOSocketOnDisconnect
  async onDisconnect(socket: Socket) {
    this.log.info(`onDisconnect: ${socket.id}`);
  }
}
