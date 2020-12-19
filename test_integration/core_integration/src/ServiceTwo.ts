import { Inject, KLogger, Service } from '@kaus/core';
import { ServiceOne } from './ServiceOne';

@Service
export class ServiceTwo {
  private log: KLogger;

  @Inject(() => ServiceOne)
  private serviceOne: ServiceOne;

  @Inject
  private serviceOneAgain: ServiceOne;

  onInit() {
    this.log.info('onInit');
    this.serviceOne.call();
  }

  call() {
    this.log.info('call');
  }
}
