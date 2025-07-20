import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedGameStatsTable1753024041131 implements MigrationInterface {
  name = 'AddedGameStatsTable1753024041131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game_stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "sumScore" integer NOT NULL DEFAULT '0', "winsCount" integer NOT NULL DEFAULT '0', "drawsCount" integer NOT NULL DEFAULT '0', "lossesCount" integer NOT NULL DEFAULT '0', "gamesCount" integer NOT NULL DEFAULT '0', "avgScores" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_289bd8cd7cadaeb5f3f75746196" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "participant" ADD "gameStatsId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "UQ_91f2887ff71d99d667692d519e5" UNIQUE ("gameStatsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_91f2887ff71d99d667692d519e5" FOREIGN KEY ("gameStatsId") REFERENCES "game_stats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_91f2887ff71d99d667692d519e5"`);
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "UQ_91f2887ff71d99d667692d519e5"`);
    await queryRunner.query(`ALTER TABLE "participant" DROP COLUMN "gameStatsId"`);
    await queryRunner.query(`DROP TABLE "game_stats"`);
  }
}
