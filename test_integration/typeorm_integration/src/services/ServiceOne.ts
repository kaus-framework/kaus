import { Service } from '@kaus/core';
import { Repository, SqlRepository } from '@kaus/typeorm';
import { UserOne, UserOneRepository } from '../models/UserOne';

@Service
export class ServiceOne {
  @SqlRepository
  private userOneRepository1: UserOneRepository;

  @SqlRepository(() => UserOneRepository)
  private userOneRepository2: UserOneRepository;

  @SqlRepository(UserOne)
  private userOneRepository3: Repository<UserOne>;

  async onInit() {
    let userOne = await this.userOneRepository1.save({ email: 'ibarrajj@gmail.com' });
    console.log(userOne);

    userOne = await this.userOneRepository2.findOneOrFail({ email: 'ibarrajj@gmail.com' });
    console.log(userOne);

    userOne = await this.userOneRepository3.findOneOrFail(userOne.id);
    console.log(userOne);

    this.userOneRepository3.delete(userOne.id);

    const users = await this.userOneRepository3.find({});
    console.log(users);
  }
}
