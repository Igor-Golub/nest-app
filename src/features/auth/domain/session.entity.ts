import { BaseEntity } from '../../../core/entities/baseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/domain/user.entity';

@Entity()
export class Session extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.sessions)
  public owner: User;

  @Column()
  public ownerId: string;

  @Column({ unique: true })
  public version: string;

  @Column({ unique: true })
  public deviceId: string;

  @Column()
  public deviceName: string;

  @Column()
  public deviceIp: string;

  @Column({
    type: 'date',
  })
  public expirationDate: Date;
}
