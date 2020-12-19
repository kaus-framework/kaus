import Bluebird from 'bluebird';
import { DIProvider } from './DIProvider';

export const onInit: any[] = [];

export async function InitFunctions() {
  return Bluebird.resolve(onInit).each((instance: any) => resolve(instance));
}

async function resolve(instance: any) {
  const res = async (instance: any) => {
    const paramtypes = Reflect.getMetadata('design:paramtypes', instance, 'onInit') || [];
    const injections = paramtypes.map((paramtype: any) => DIProvider.resolveInstance<any>(paramtype));
    return await instance['onInit'](...injections);
  };
  if (typeof instance.onInit === 'function') return await res(instance);
}
