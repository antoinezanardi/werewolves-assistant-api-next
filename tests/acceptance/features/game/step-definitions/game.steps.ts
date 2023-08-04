import { Given } from "@cucumber/cucumber";
import type { Game } from "../../../../../src/modules/game/schemas/game.schema";
import { createFakeGame } from "../../../../factories/game/schemas/game.schema.factory";
import { readJsonFile } from "../../../shared/helpers/file.helper";

Given(/^a game described in file (?<filename>.*\.json)$/u, (fileName: string): void => {
  const game = createFakeGame(readJsonFile<Game>("game", fileName));
  console.log(game);
});