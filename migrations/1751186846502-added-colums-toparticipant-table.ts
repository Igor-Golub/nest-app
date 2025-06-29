import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedColumsToparticipantTable1751186846502 implements MigrationInterface {
  name = 'AddedColumsToparticipantTable1751186846502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" ADD "score" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(
      `CREATE TYPE "public"."participant_resultofgame_enum" AS ENUM('InProgress', 'Won', 'Lost', 'Draw')`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD "resultOfGame" "public"."participant_resultofgame_enum" NOT NULL DEFAULT 'InProgress'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" DROP COLUMN "resultOfGame"`);
    await queryRunner.query(`DROP TYPE "public"."participant_resultofgame_enum"`);
    await queryRunner.query(`ALTER TABLE "participant" DROP COLUMN "score"`);
  }
}
