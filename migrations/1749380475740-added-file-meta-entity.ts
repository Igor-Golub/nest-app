import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFileMetaEntity1749380475740 implements MigrationInterface {
  name = 'AddedFileMetaEntity1749380475740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "uploaded_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "originalName" character varying NOT NULL, "storedName" character varying NOT NULL, "mimetype" character varying NOT NULL, "size" integer NOT NULL, "path" character varying NOT NULL, CONSTRAINT "PK_e2aa19a0c9b98da779d8eb571fa" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "uploaded_file"`);
  }
}
