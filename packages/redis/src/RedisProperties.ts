export class RedisProperties {
  host: string = process.env.REDIS_HOST || 'localhost';
  port: string = process.env.REDIS_PORT || '6379';
  password: string | undefined = process.env.REDIS_PASSWORD;
}
