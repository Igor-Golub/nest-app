import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Confirmation } from './confirm.entity';
import type { Account } from './account.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  public login: string;

  @Column()
  public email: string;

  @Column()
  public hash: string;

  @Column({
    default: false,
  })
  public isConfirmed: boolean;

  @OneToOne('Confirmation', (confirmation: Confirmation) => confirmation.owner)
  public confirmation: Confirmation;

  @OneToOne('Account', (account: Account) => account.owner)
  public account: Account;
}
