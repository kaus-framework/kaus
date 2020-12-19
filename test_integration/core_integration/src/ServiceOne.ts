import { Inject, KLogger, Service } from '@kaus/core';
import { ServiceTwo } from './ServiceTwo';

@Service
export class ServiceOne {
  private log: KLogger;

  @Inject
  private serviceTwo: ServiceTwo;

  onInit() {
    this.log.info('onInit');
    this.serviceTwo.call();
  }

  call() {
    this.log.info('call');
  }
}
