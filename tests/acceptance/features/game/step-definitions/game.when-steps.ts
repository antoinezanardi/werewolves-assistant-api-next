import type { DataTable } from "@cucumber/cucumber";
import { When } from "@cucumber/cucumber";
import type { MakeGamePlayDto } from "../../../../../src/modules/game/dto/make-game-play/make-game-play.dto";
import type { WITCH_POTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import { getPlayerWithNameOrThrow } from "../../../../../src/modules/game/helpers/game.helper";
import type { Game } from "../../../../../src/modules/game/schemas/game.schema";
import type { CustomWorld } from "../../../shared/types/world.types";
import { convertDatatableToMakeGameplayVotes } from "../helpers/game-datatable.helper";
import { makeGamePlayRequest } from "../helpers/game-request.helper";

When(/^all elect sheriff with the following votes$/u, async function(this: CustomWorld, votesDatatable: DataTable): Promise<void> {
  const votes = convertDatatableToMakeGameplayVotes(votesDatatable.rows(), this.game);
  const makeGamePlayDto: MakeGamePlayDto = { votes };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  this.game = this.response.json<Game>();
});

When(/^all vote with the following votes$/u, async function(this: CustomWorld, votesDatatable: DataTable): Promise<void> {
  const votes = convertDatatableToMakeGameplayVotes(votesDatatable.rows(), this.game);
  const makeGamePlayDto: MakeGamePlayDto = { votes };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  this.game = this.response.json<Game>();
});

When(/^the sheriff delegates his role to the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  this.game = this.response.json<Game>();
});

When(/^the seer looks at the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  this.game = this.response.json<Game>();
});

When(/^the werewolves eat the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  this.game = this.response.json<Game>();
});

When(
  /^the witch uses (?<potion1>life|death) potion on the player named (?<name1>.+?)(?: and (?<potion2>(?!\k<potion1>)(?:life|death)) potion on the player named (?<name2>.+?))?$/u,
  async function(this: CustomWorld, firstPotion: WITCH_POTIONS, firstTargetName: string, secondPotion: WITCH_POTIONS | null, secondTargetName: string | null): Promise<void> {
    const firstTarget = getPlayerWithNameOrThrow(firstTargetName, this.game, new Error("Player name not found"));
    const targets = [{ playerId: firstTarget._id, drankPotion: firstPotion }];
    if (secondTargetName !== null && secondPotion !== null) {
      const secondTarget = getPlayerWithNameOrThrow(secondTargetName, this.game, new Error("Player name not found"));
      targets.push({ playerId: secondTarget._id, drankPotion: secondPotion });
    }
    this.response = await makeGamePlayRequest({ targets }, this.game, this.app);
    this.game = this.response.json<Game>();
  },
);

When(/^the hunter shoots at the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  this.game = this.response.json<Game>();
});

When(/^the player or group skips his turn$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  this.game = this.response.json<Game>();
});