import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedGameEntities1747576520081 implements MigrationInterface {
  name = 'AddedGameEntities1747576520081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "answers" jsonb NOT NULL, "published" boolean NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c76e93dfef28ba9b6942f578ab1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gameId" uuid NOT NULL, CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isCorrect" boolean NOT NULL, "participantId" uuid, "questionId" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."game_status_enum" AS ENUM('pending', 'active', 'finished')`,
    );
    await queryRunner.query(
      `CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."game_status_enum" NOT NULL DEFAULT 'pending', "startedAt" TIMESTAMP NOT NULL, "finishedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_questions_question" ("gameId" uuid NOT NULL, "questionId" uuid NOT NULL, CONSTRAINT "PK_c779b1a9eb7c4196de6fbf0cf39" PRIMARY KEY ("gameId", "questionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fddc6783cfe03a282274dad5af" ON "game_questions_question" ("gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_200a49f632034380c384928d3a" ON "game_questions_question" ("questionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_25abe6e5bfa66b03fd19ade94f8" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_31b8c9e1dc950f87111a89eb4b9" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_questions_question" ADD CONSTRAINT "FK_fddc6783cfe03a282274dad5aff" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_questions_question" ADD CONSTRAINT "FK_200a49f632034380c384928d3a4" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_questions_question" DROP CONSTRAINT "FK_200a49f632034380c384928d3a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_questions_question" DROP CONSTRAINT "FK_fddc6783cfe03a282274dad5aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_31b8c9e1dc950f87111a89eb4b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" DROP CONSTRAINT "FK_25abe6e5bfa66b03fd19ade94f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_200a49f632034380c384928d3a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fddc6783cfe03a282274dad5af"`,
    );
    await queryRunner.query(`DROP TABLE "game_questions_question"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP TYPE "public"."game_status_enum"`);
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "participant"`);
    await queryRunner.query(`DROP TABLE "stats"`);
    await queryRunner.query(`DROP TABLE "question"`);
  }
}
