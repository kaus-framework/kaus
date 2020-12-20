import { DIProvider } from '@kaus/core';

const metadata_socket_namespaces: string = '__metadata:io_socket_namespaces__';

export interface SocketIONamespaces {
  key: string | symbol;
  path: string;
}

function annotate(namespace: string, target: any, key: string | symbol) {
  const namespaces: SocketIONamespaces[] = Reflect.getMetadata(metadata_socket_namespaces, target) || [];
  namespaces.push({ key: key, path: namespace });
  Reflect.defineMetadata(metadata_socket_namespaces, namespaces, target.constructor);
}

export function getIONamespaces(instance: any): SocketIONamespaces[] {
  instance = DIProvider.resolveInstance(instance);
  return Reflect.getMetadata(metadata_socket_namespaces, instance.constructor) || [];
}

export function hasIONamespace(instance: any): boolean {
  instance = DIProvider.resolveInstance(instance);
  return Reflect.hasMetadata(metadata_socket_namespaces, instance.constructor);
}

export function IONamespace(namespace: string) {
  return (target: any, key: string | symbol) => annotate(namespace, target, key);
}
