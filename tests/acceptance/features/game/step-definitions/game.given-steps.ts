import type { DataTable } from "@cucumber/cucumber";
import { Given } from "@cucumber/cucumber";
import { plainToInstance } from "class-transformer";
import { construct, crush } from "radash";
import { CreateGameDto } from "../../../../../src/modules/game/dto/create-game/create-game.dto";
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
  /^a created game(?: with options described in files? (?<filename>(?:[\w-]+\.json(?:,\s)?)+) and)? with the following players$/u,
  async function(this: CustomWorld, fileNames: string | null, playersDatatable: DataTable): Promise<void> {
    let options = {};
    if (fileNames !== null) {
      const flatOptions = fileNames.split(",").reduce((acc, fileName) => {
        const flatOption = crush(readJsonFile<GameOptions>("game", fileName.trim()));
        return { ...acc, ...flatOption };
      }, {});
      options = construct<Record<string, unknown>>(flatOptions);
    }
    const players = convertDatatableToCreateGamePlayersDto(playersDatatable.rows());
    const createGameDto: CreateGameDto = plainToInstance(CreateGameDto, { players, options }, plainToInstanceDefaultOptions);

    this.response = await createGameRequest(createGameDto, this.app);
    this.game = this.response.json<Game>();
  },
);