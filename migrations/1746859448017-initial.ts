import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1746859448017 implements MigrationInterface {
  name = 'Initial1746859448017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "login" character varying NOT NULL, "email" character varying NOT NULL, "hash" character varying NOT NULL, "isConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "confirmation_type_enum" AS ENUM('1')`,
    );
    await queryRunner.query(
      `CREATE TYPE "confirmation_status_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "confirmation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid NOT NULL, "code" character varying, "expirationAt" character varying NOT NULL, "type" "confirmation_type_enum" NOT NULL, "status" "confirmation_status_enum" NOT NULL DEFAULT '1', CONSTRAINT "REL_da947caf00f8d2917ff7774aee" UNIQUE ("ownerId"), CONSTRAINT "PK_3eee17867bc79b59e68f5f879fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "recovery_status_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "recovery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying, "ownerId" uuid NOT NULL, "expirationAt" date, "status" "recovery_status_enum" NOT NULL DEFAULT '1', CONSTRAINT "REL_1fdc40759a18d1b73e63614df6" UNIQUE ("ownerId"), CONSTRAINT "PK_47b2530af2d597ff1b210847140" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid NOT NULL, "version" character varying NOT NULL, "deviceId" character varying NOT NULL, "deviceName" character varying NOT NULL, "deviceIp" character varying NOT NULL, "expirationDate" date NOT NULL, CONSTRAINT "UQ_42b7f7c6c3d02fd4749c711ec1d" UNIQUE ("version"), CONSTRAINT "UQ_c57e995074bf9afc1a2953d2329" UNIQUE ("deviceId"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "blogId" uuid NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "websiteUrl" character varying NOT NULL, "isMembership" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "comment_like_status_enum" AS ENUM('None', 'Like', 'Dislike')`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid NOT NULL, "commentId" uuid NOT NULL, "status" "comment_like_status_enum" NOT NULL DEFAULT 'None', CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid NOT NULL, "authorId" uuid NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_5a0d63e41c3c55e11319613550c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "post_like_status_enum" AS ENUM('None', 'Like', 'Dislike')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid NOT NULL, "ownerId" uuid NOT NULL, "status" "post_like_status_enum" NOT NULL DEFAULT 'None', CONSTRAINT "PK_0e95caa8a8b56d7797569cf5dc6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "confirmation" ADD CONSTRAINT "FK_da947caf00f8d2917ff7774aeeb" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery" ADD CONSTRAINT "FK_1fdc40759a18d1b73e63614df62" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_e1dde0bd0402cc9b1967c40a1b3" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_d0418ddc42c5707dbc37b05bef9" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" ADD CONSTRAINT "FK_1fa8d94974740f94900340a3e8f" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" ADD CONSTRAINT "FK_a253dba95eab8659c027bbace44" FOREIGN KEY ("commentId") REFERENCES "post_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment" ADD CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment" ADD CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" ADD CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" ADD CONSTRAINT "FK_19cad4b8be2c396000696d12531" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_like" DROP CONSTRAINT "FK_19cad4b8be2c396000696d12531"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" DROP CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment" DROP CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment" DROP CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" DROP CONSTRAINT "FK_a253dba95eab8659c027bbace44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" DROP CONSTRAINT "FK_1fa8d94974740f94900340a3e8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_d0418ddc42c5707dbc37b05bef9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_e1dde0bd0402cc9b1967c40a1b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery" DROP CONSTRAINT "FK_1fdc40759a18d1b73e63614df62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "confirmation" DROP CONSTRAINT "FK_da947caf00f8d2917ff7774aeeb"`,
    );
    await queryRunner.query(`DROP TABLE "post_like"`);
    await queryRunner.query(`DROP TYPE "post_like_status_enum"`);
    await queryRunner.query(`DROP TABLE "post_comment"`);
    await queryRunner.query(`DROP TABLE "comment_like"`);
    await queryRunner.query(`DROP TYPE "comment_like_status_enum"`);
    await queryRunner.query(`DROP TABLE "blog"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "recovery"`);
    await queryRunner.query(`DROP TYPE "recovery_status_enum"`);
    await queryRunner.query(`DROP TABLE "confirmation"`);
    await queryRunner.query(`DROP TYPE "confirmation_status_enum"`);
    await queryRunner.query(`DROP TYPE "confirmation_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
