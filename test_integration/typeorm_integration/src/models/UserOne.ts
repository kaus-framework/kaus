import { Column, CreateDateColumn, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from '@kaus/typeorm';

@Entity()
export class UserOne {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

@EntityRepository(UserOne)
export class UserOneRepository extends Repository<UserOne> {}
