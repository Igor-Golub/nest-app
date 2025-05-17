import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GameController } from "./api/public/game.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    // TypeOrmModule.forFeature([]), // Will add entities when they are created
  ],
  providers: [
    // Will add services and handlers when they are created
  ],
  controllers: [
    GameController
  ],
  exports: [
    // Will add exports when needed
  ]
})
export class QuizGameModule {}