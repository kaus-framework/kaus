export interface RedisSubscribeHandler {
  readonly channel: string;
  readonly propertyKey: string;
}

const metadata_redis_subscribe_handler: string = '__metadata:redis_subscribe_handler__';

function annotate(target: any, propertyKey: string, channel: string) {
  const subscribeHandlers = Reflect.getMetadata(metadata_redis_subscribe_handler, target) || [];
  subscribeHandlers.push({ channel: channel, propertyKey: propertyKey });
  Reflect.defineMetadata(metadata_redis_subscribe_handler, subscribeHandlers, target);
}

export function hasRedisSubscribe(instance: any) {
  return Reflect.hasMetadata(metadata_redis_subscribe_handler, instance);
}

export function getRedisSubscribeHandlers(instance: any): RedisSubscribeHandler[] {
  return Reflect.getMetadata(metadata_redis_subscribe_handler, instance);
}

export function RedisSubscribe(channel: string) {
  return (target: any, propertyKey: string, _descriptor?: PropertyDescriptor) => annotate(target, propertyKey, channel);
}
