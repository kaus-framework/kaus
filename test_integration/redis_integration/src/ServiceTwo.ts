import { KLogger, Service } from '@kaus/core';
import { redisClient, RedisSubscribe } from '@kaus/redis';

@Service
export class ServiceTwo {
  private log: KLogger;

  @RedisSubscribe('redis')
  async onRedisMessage(message: string) {
    this.log.info(`on message: ${message}`);
    redisClient.publish('redis-from-client', new Date().toString());
  }
}
