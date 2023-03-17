import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "../config/database/database.module";
import { GameController } from "./game.controller";
import { GameRepository } from "./game.repository";
import { GameService } from "./game.service";
import { Game, GameSchema } from "./schemas/game.schema";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  controllers: [GameController],
  providers: [GameService, GameRepository],
})
export class GameModule {}