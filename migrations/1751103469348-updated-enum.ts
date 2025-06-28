import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedEnum1751103469348 implements MigrationInterface {
  name = 'UpdatedEnum1751103469348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."game_status_enum" RENAME TO "game_status_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."game_status_enum" AS ENUM('PendingSecondPlayer', 'Active', 'Finished')`,
    );
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "status" TYPE "public"."game_status_enum" USING "status"::"text"::"public"."game_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "status" SET DEFAULT 'PendingSecondPlayer'`);
    await queryRunner.query(`DROP TYPE "public"."game_status_enum_old"`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "startedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "startedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "finishedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "finishedAt" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "finishedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "finishedAt" date`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "startedAt"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "startedAt" date`);
    await queryRunner.query(`CREATE TYPE "public"."game_status_enum_old" AS ENUM('pending', 'active', 'finished')`);
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "game" ALTER COLUMN "status" TYPE "public"."game_status_enum_old" USING "status"::"text"::"public"."game_status_enum_old"`,
    );
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    await queryRunner.query(`DROP TYPE "public"."game_status_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."game_status_enum_old" RENAME TO "game_status_enum"`);
  }
}
