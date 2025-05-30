import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameDomainEntities1748631761094 implements MigrationInterface {
  name = 'UpdateGameDomainEntities1748631761094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "answer" RENAME COLUMN "isCorrect" TO "status"`);
    await queryRunner.query(`ALTER TABLE "game" ADD "pairCreatedAt" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "participant" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "UQ_b915e97dea27ffd1e40c8003b3b" UNIQUE ("userId")`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "status"`);
    await queryRunner.query(`CREATE TYPE "public"."answer_status_enum" AS ENUM('Correct', 'InCorrect')`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "status" "public"."answer_status_enum" NOT NULL DEFAULT 'InCorrect'`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`);
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."answer_status_enum"`);
    await queryRunner.query(`ALTER TABLE "answer" ADD "status" boolean NOT NULL`);
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "UQ_b915e97dea27ffd1e40c8003b3b"`);
    await queryRunner.query(`ALTER TABLE "participant" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "pairCreatedAt"`);
    await queryRunner.query(`ALTER TABLE "answer" RENAME COLUMN "status" TO "isCorrect"`);
  }
}
