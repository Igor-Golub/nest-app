import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';

@Entity()
export class UploadedFile extends BaseEntity {
  @Column()
  originalName: string;

  @Column()
  storedName: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  path: string;
}
