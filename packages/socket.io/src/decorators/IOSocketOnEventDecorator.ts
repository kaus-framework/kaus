import { DIProvider } from '@kaus/core';

export interface IOSocketEventHandler {
  readonly event: string;
  readonly propertyKey: string;
}
const metadata_socket_event_handler: string = '__metadata:io_socket_event_handler__';

function IOSocketOnDecorator(event: string, target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  return annotate(event, target, propertyKey, descriptor);
}

function annotate(event: string, target: any, propertyKey: string, _descriptor?: PropertyDescriptor) {
  const eventHandler: IOSocketEventHandler = {
    event: event,
    propertyKey: propertyKey,
  };
  const eventHandlers: IOSocketEventHandler[] = Reflect.getMetadata(metadata_socket_event_handler, target.constructor) || [];
  eventHandlers.push(eventHandler);
  Reflect.defineMetadata(metadata_socket_event_handler, eventHandlers, target.constructor);
}

export function getIOSocketEventHandler(instance: any): IOSocketEventHandler[] {
  instance = DIProvider.resolveInstance(instance);
  return Reflect.getMetadata(metadata_socket_event_handler, instance.constructor) || [];
}

export function IOSocketOnConnection(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export function IOSocketOnConnection(target: any | undefined, propertyKey: string, descriptor: PropertyDescriptor) {
  return IOSocketOnDecorator('connection', target, propertyKey, descriptor);
}

export function IOSocketOnDisconnect(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export function IOSocketOnDisconnect(target: any | undefined, propertyKey: string, descriptor: PropertyDescriptor) {
  return IOSocketOnDecorator('disconnect', target, propertyKey, descriptor);
}

export function IOSocketOnEvent(event: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    return IOSocketOnDecorator(event, target, propertyKey, descriptor);
  };
}
