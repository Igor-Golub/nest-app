import { BaseEntity } from '../../../core/entities/baseEntity';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/domain/user.entity';

export class Session extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.confirmation)
  @JoinColumn()
  owner: User;

  @Column()
  version: string;

  @Column()
  deviceId: string;

  @Column()
  deviceName: string;

  @Column()
  deviceIp: string;

  @Column({
    type: 'date',
  })
  expirationDate: Date;
}
