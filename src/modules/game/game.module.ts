import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "../config/database/database.module";
import { GameController } from "./controllers/game.controller";
import { GameRepository } from "./providers/game.repository";
import { GameService } from "./providers/game.service";
import { Game, GameSchema } from "./schemas/game.schema";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  controllers: [GameController],
  providers: [GameService, GameRepository],
})
export class GameModule {}