import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedAnswerStatusEnum1751124860625 implements MigrationInterface {
    name = 'UpdatedAnswerStatusEnum1751124860625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."answer_status_enum" RENAME TO "answer_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."answer_status_enum" AS ENUM('Correct', 'Incorrect')`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" TYPE "public"."answer_status_enum" USING "status"::"text"::"public"."answer_status_enum"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" SET DEFAULT 'Incorrect'`);
        await queryRunner.query(`DROP TYPE "public"."answer_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."answer_status_enum_old" AS ENUM('Correct', 'InCorrect')`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" TYPE "public"."answer_status_enum_old" USING "status"::"text"::"public"."answer_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" SET DEFAULT 'InCorrect'`);
        await queryRunner.query(`DROP TYPE "public"."answer_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."answer_status_enum_old" RENAME TO "answer_status_enum"`);
    }

}
