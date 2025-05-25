import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity<Id extends string | number = string> {
  @PrimaryGeneratedColumn('uuid')
  public id: Id;

  // https://typeorm.io/entities#special-columns
  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
