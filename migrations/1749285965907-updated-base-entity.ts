import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedBaseEntity1749285965907 implements MigrationInterface {
  name = 'UpdatedBaseEntity1749285965907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "confirmation" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "participant" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "recovery" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post_like" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post_comment" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "blog" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "comment_like" ALTER COLUMN "updatedAt" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment_like" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "blog" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post_comment" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post_like" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "recovery" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "stats" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "participant" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "confirmation" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "updatedAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET NOT NULL`);
  }
}
