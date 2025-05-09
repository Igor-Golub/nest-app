import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import { User } from './user.entity';

export enum ConfirmationStatuses {
  Created = 1,
  Failed = 2,
  Success = 3,
}

export enum ConfirmationTypes {
  Email = 1,
}

@Entity()
export class Confirmation extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.confirmation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public owner: User;

  @Column()
  public ownerId: string;

  @Column({ nullable: true, default: null })
  public code: string;

  @Column()
  public expirationAt: string;

  @Column({ type: 'enum', enum: ConfirmationTypes })
  public type: ConfirmationTypes;

  @Column({
    type: 'enum',
    enum: ConfirmationStatuses,
    default: ConfirmationStatuses.Created,
  })
  public status: ConfirmationStatuses;
}
