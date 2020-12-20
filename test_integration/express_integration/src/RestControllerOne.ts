import { KLogger } from '@kaus/core';
import { Get, Header, Query, RestController } from '@kaus/http';

@RestController
export class RestControllerOne {
  private log: KLogger;

  @Get
  async getEndpoint(@Query query: string, @Header('Accept-Language') language: string) {
    return { endpoint: '/', restController: 'RestControllerOne', propertyKey: 'getEndpoint', query: query, language: language };
  }
}
