import { Given } from "@cucumber/cucumber";
import type { CreateGameDto } from "../../../../../src/modules/game/dto/create-game/create-game.dto";
import type { Game } from "../../../../../src/modules/game/schemas/game.schema";
import { readJsonFile } from "../../../shared/helpers/file.helper";
import type { CustomWorld } from "../../../shared/types/world.types";
import { createGameRequest } from "../helpers/game-request.helper";

Given(/^a created game described in file (?<filename>.+\.json)$/u, async function(this: CustomWorld, fileName: string): Promise<void> {
  const createGameDto = readJsonFile<CreateGameDto>("game", fileName);

  this.response = await createGameRequest(createGameDto, this.app);
  this.game = this.response.json<Game>();
});