import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import { User } from './user.entity';

@Entity()
export class Account extends BaseEntity {
  @Column({
    type: 'text',
  })
  public bio: string;

  @OneToOne(() => User, (user: User) => user.account, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public owner: User;
}
