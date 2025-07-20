import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedStatsRelations1753024880655 implements MigrationInterface {
  name = 'UpdatedStatsRelations1753024880655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_91f2887ff71d99d667692d519e5"`);
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "UQ_91f2887ff71d99d667692d519e5"`);
    await queryRunner.query(`ALTER TABLE "participant" DROP COLUMN "gameStatsId"`);
    await queryRunner.query(`ALTER TABLE "game_stats" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "game_stats" ADD CONSTRAINT "UQ_c06c562c8c920b00646aad45710" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_stats" ADD CONSTRAINT "FK_c06c562c8c920b00646aad45710" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game_stats" DROP CONSTRAINT "FK_c06c562c8c920b00646aad45710"`);
    await queryRunner.query(`ALTER TABLE "game_stats" DROP CONSTRAINT "UQ_c06c562c8c920b00646aad45710"`);
    await queryRunner.query(`ALTER TABLE "game_stats" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "participant" ADD "gameStatsId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "UQ_91f2887ff71d99d667692d519e5" UNIQUE ("gameStatsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_91f2887ff71d99d667692d519e5" FOREIGN KEY ("gameStatsId") REFERENCES "game_stats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
