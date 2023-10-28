import { Given } from "@cucumber/cucumber";
import { plainToInstance } from "class-transformer";
import { construct, crush } from "radash";
import type { DataTable } from "@cucumber/cucumber";

import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { setGameInContext } from "@tests/acceptance/shared/helpers/context.helper";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";
import { readJsonFile } from "@tests/acceptance/shared/helpers/file.helper";
import { createGameRequest } from "@tests/acceptance/features/game/helpers/game-request.helper";
import { convertDatatableToCreateGamePlayersDto } from "@tests/acceptance/features/game/helpers/game-datatable.helper";

Given(/^a created game described in file (?<filename>.+\.json)$/u, async function(this: CustomWorld, fileName: string): Promise<void> {
  const createGameDto = readJsonFile<CreateGameDto>("game", fileName);

  this.response = await createGameRequest(createGameDto, this.app);
  setGameInContext(this.response, this);
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
    }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);

    this.response = await createGameRequest(createGameDto, this.app);
    setGameInContext(this.response, this);
  },
);