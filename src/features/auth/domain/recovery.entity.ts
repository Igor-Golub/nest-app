import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import { User } from '../../users/domain/user.entity';

export declare enum RecoveryStatuses {
  Created = 1,
  Failed = 2,
  Success = 3,
}

@Entity()
export class Recovery extends BaseEntity {
  @Column({ nullable: true })
  code: string;

  @OneToOne(() => User, (user: User) => user.recovery)
  @JoinColumn()
  owner: User;

  @Column({ type: 'date', nullable: true })
  expirationAt: Date;

  @Column({
    type: 'enum',
    enum: RecoveryStatuses,
    default: RecoveryStatuses.Created,
  })
  status: RecoveryStatuses;
}
