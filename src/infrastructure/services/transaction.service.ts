import { DataSource, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  public async runInTransaction<T>(dataSource: DataSource, fn: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const result = await fn(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
