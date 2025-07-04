import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedRelationsUserParticipant1751613114822 implements MigrationInterface {
  name = 'UpdatedRelationsUserParticipant1751613114822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`);
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "UQ_b915e97dea27ffd1e40c8003b3b"`);
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`);
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "UQ_b915e97dea27ffd1e40c8003b3b" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
