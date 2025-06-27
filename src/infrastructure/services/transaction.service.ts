import { DataSource, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  public async runInTransaction<T>(
    dataSource: DataSource,
    fn: (queryRunner: QueryRunner) => Promise<T>,
    options?: {
      lockMode?: 'pessimistic_read' | 'pessimistic_write' | 'for_update' | 'for_no_key_update';
      isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';
    },
  ): Promise<T> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    if (options?.isolationLevel) {
      await queryRunner.query(`SET TRANSACTION ISOLATION LEVEL ${options.isolationLevel}`);
    }

    await queryRunner.startTransaction();

    try {
      if (options?.lockMode === 'for_update') {
        await queryRunner.query('SELECT 1');
      }

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
