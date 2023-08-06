import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "expect";
import type { CreateGameDto } from "../../../../../src/modules/game/dto/create-game/create-game.dto";
import type { MakeGamePlayDto } from "../../../../../src/modules/game/dto/make-game-play/make-game-play.dto";
import { getPlayerWithNameOrThrow } from "../../../../../src/modules/game/helpers/game.helper";
import type { Game } from "../../../../../src/modules/game/schemas/game.schema";
import { readJsonFile } from "../../../shared/helpers/file.helper";
import type { CustomWorld } from "../../../shared/types/world.types";

Given(/^a created game described in file (?<filename>.+\.json)$/u, async function(this: CustomWorld, fileName: string): Promise<void> {
  const createGameDto = readJsonFile<CreateGameDto>("game", fileName);
  this.response = await this.app.inject({
    method: "POST",
    url: "/games",
    payload: createGameDto,
  });
  this.game = this.response.json<Game>();
});

When(/^the seer looks the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await this.app.inject({
    method: "POST",
    url: `/games/${this.game._id.toString()}/play`,
    payload: makeGamePlayDto,
  });
  this.game = this.response.json<Game>();
});

Then(/^the game's tick is (?<tick>\d)$/u, function(this: CustomWorld, tick: string): void {
  expect(this.game.tick).toBe(parseInt(tick));
});