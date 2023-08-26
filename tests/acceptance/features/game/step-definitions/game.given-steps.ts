import type { DataTable } from "@cucumber/cucumber";
import { Given } from "@cucumber/cucumber";
import { plainToInstance } from "class-transformer";
import { construct, crush } from "radash";
import { CreateGameDto } from "../../../../../src/modules/game/dto/create-game/create-game.dto";
import type { GameAdditionalCard } from "../../../../../src/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { GameOptions } from "../../../../../src/modules/game/schemas/game-options/game-options.schema";
import type { Game } from "../../../../../src/modules/game/schemas/game.schema";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { readJsonFile } from "../../../shared/helpers/file.helper";
import type { CustomWorld } from "../../../shared/types/world.types";
import { convertDatatableToCreateGamePlayersDto } from "../helpers/game-datatable.helper";
import { createGameRequest } from "../helpers/game-request.helper";

Given(/^a created game described in file (?<filename>.+\.json)$/u, async function(this: CustomWorld, fileName: string): Promise<void> {
  const createGameDto = readJsonFile<CreateGameDto>("game", fileName);

  this.response = await createGameRequest(createGameDto, this.app);
  this.game = this.response.json<Game>();
});

Given(
  /^a created game(?: with additional cards described in file (?<cardsFilename>[\w-]+\.json) and)?(?: with options described in files? (?<optionFilenames>(?:[\w-]+\.json(?:,\s)?)+) and)? with the following players$/u,
  async function(this: CustomWorld, cardsFileName: string | null, optionFilenames: string | null, playersDatatable: DataTable): Promise<void> {
    let additionalCards: GameAdditionalCard[] = [];
    if (cardsFileName !== null) {
      additionalCards = readJsonFile<GameAdditionalCard[]>("game", cardsFileName);
    }
    let options = {};
    if (optionFilenames !== null) {
      const flatOptions = optionFilenames.split(",").reduce((acc, fileName) => {
        const flatOption = crush(readJsonFile<GameOptions>("game", fileName.trim()));
        return { ...acc, ...flatOption };
      }, {});
      options = construct<Record<string, unknown>>(flatOptions);
    }
    const players = convertDatatableToCreateGamePlayersDto(playersDatatable.rows());
    const createGameDto: CreateGameDto = plainToInstance(CreateGameDto, {
      players,
      options,
      additionalCards: additionalCards.length ? additionalCards : undefined,
    }, plainToInstanceDefaultOptions);

    this.response = await createGameRequest(createGameDto, this.app);
    this.game = this.response.json<Game>();
  },
);