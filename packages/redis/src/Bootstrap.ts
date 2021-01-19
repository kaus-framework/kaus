import { Bootstrap, DIProvider, KLogger } from '@kaus/core';
import Bluebird from 'bluebird';
import { RedisClient } from 'redis';
import { getRedisSubscribeHandlers, hasRedisSubscribe, RedisSubscribeHandler } from './decorators';
import { RedisProperties } from './RedisProperties';

const log: KLogger = new KLogger('@kaus:redis');

export let redisClient: RedisClient;
export let redisClientPublisher: RedisClient;
export let redisClientSubscriber: RedisClient;

const subscriberHandlersMap: { [key: string]: ((data: string) => void)[] } = {};

Bootstrap.registerModule({
  bootstraper: async () => {
    const properties = new RedisProperties();
    return new Bluebird((resolve) => {
      redisClient = new RedisClient({
        host: properties.host,
        port: new Number(properties.port).valueOf(),
        password: properties.password,
        socket_keepalive: true,
      });

      redisClient.on('error', (err) => log.error(err));

      redisClient.on('ready', () => {
        redisClient.ping((_: any, _result: any) => resolve());
      });
    })
      .then(() => {
        redisClientPublisher = redisClient.duplicate();
        redisClientSubscriber = redisClient.duplicate();
      })
      .then(() => {
        redisClient.on('error', (err) => log.error(`redis client error: \r\n${err}`));
        redisClientPublisher.on('error', (err) => log.error(`redis client publisher error: \r\n${err}`));
        redisClientSubscriber.on('error', (err) => log.error(`redis client subscriber error: \r\n${err}`));
      })
      .then(() => log.info(`redis: connection has been established successfully.`))
      .then(() => resolveSubscribers(redisClientSubscriber));
  },
  shutdown: async () =>
    Bluebird.resolve(Object.keys(subscriberHandlersMap))
      .each((channel) => redisClientSubscriber.unsubscribe(channel))
      .then(() => new Bluebird((resolve: any) => redisClient.quit((err) => resolve())))
      .then(() => new Bluebird((resolve: any) => redisClientPublisher.quit((err) => resolve())))
      .then(() => new Bluebird((resolve: any) => redisClientSubscriber.quit((err) => resolve())))
      .then(() => log.info(`redis: connection shutdown`)),
});

async function resolveSubscribers(clientSubscriber: RedisClient) {
  const map = (instance: any, handlers: RedisSubscribeHandler[]) => {
    handlers.forEach((handler) => {
      if (!subscriberHandlersMap[handler.channel]) subscriberHandlersMap[handler.channel] = [];
      subscriberHandlersMap[handler.channel].push((data: string) => instance[handler.propertyKey](data));
    });
  };

  const resolve = () => clientSubscriber.on('message', (channel, data) => subscriberHandlersMap[channel].forEach((handler) => handler(data)));

  return Bluebird.resolve(Object.values(DIProvider.instanceCollector))
    .filter((instance) => hasRedisSubscribe(instance))
    .each((instance) => map(instance, getRedisSubscribeHandlers(instance)))
    .then(() => resolve())
    .then(() => Object.keys(subscriberHandlersMap))
    .each((channel) => clientSubscriber.subscribe(channel));
}
