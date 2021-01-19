import { KLogger, Service } from '@kaus/core';
import { redisClient, RedisSubscribe } from '@kaus/redis';

@Service
export class ServiceOne {
  private log: KLogger;

  onInit() {
    redisClient.set('my-val', new Date().toString());
    redisClient.get('my-val', (err, reply) => {
      if (err) return;
      this.log.info(`my-val: ${reply}`);
    });
    redisClient.del('my-val');
    redisClient.get('my-val', (err, reply) => {
      if (err) return;
      this.log.info(`my-val: ${reply}`);
    });
  }

  @RedisSubscribe('redis')
  async onRedisMessage(message: string) {
    this.log.info(`on message: ${message}`);
  }

  @RedisSubscribe('redis-from-client')
  async onRedisMessageFromClient(message: string) {
    this.log.info(`on message from client: ${message}`);
  }
}
