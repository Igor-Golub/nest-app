import { MigrationInterface, QueryRunner } from 'typeorm';

export class MadeGameStartedAtColumnNullable1748977897362 implements MigrationInterface {
  name = 'MadeGameStartedAtColumnNullable1748977897362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "pairCreatedAt"`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "startedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "startedAt" date`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "finishedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "finishedAt" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "finishedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "finishedAt" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "startedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "startedAt" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "game" ADD "pairCreatedAt" TIMESTAMP NOT NULL`);
  }
}
