import { BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from './baseEntity';

export abstract class BaseTrackedEntity<Id extends string | number = string> extends BaseEntity<Id> {
  @BeforeInsert()
  private setUpdatedAtNull() {
    this.updatedAt = null;
  }

  @BeforeUpdate()
  private updateTimestamp() {
    this.updatedAt = new Date();
  }
}
