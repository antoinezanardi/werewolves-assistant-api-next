import type { DataTable } from "@cucumber/cucumber";
import { When } from "@cucumber/cucumber";

import type { RoleName, RoleSide } from "@/modules/role/types/role.types";
import type { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import { getPlayerWithNameOrThrow } from "@/modules/game/helpers/game.helpers";
import type { WitchPotion } from "@/modules/game/types/game-play/game-play.types";

import { convertDatatableToMakeGamePlayTargets, convertDatatableToMakeGameplayVotes } from "@tests/acceptance/features/game/helpers/game-datatable.helpers";
import { makeGamePlayRequest } from "@tests/acceptance/features/game/helpers/game-request.helpers";
import { setGameInContext } from "@tests/acceptance/shared/helpers/context.helpers";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

When(/^the survivors elect sheriff with the following votes$/u, async function(this: CustomWorld, votesDatatable: DataTable): Promise<void> {
  const votes = convertDatatableToMakeGameplayVotes(votesDatatable.rows(), this.game);
  const makeGamePlayDto: MakeGamePlayDto = { votes };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(
  /^the survivors vote with the following votes$/u,
  async function(this: CustomWorld, votesDatatable: DataTable): Promise<void> {
    const votes = convertDatatableToMakeGameplayVotes(votesDatatable.rows(), this.game);
    const makeGamePlayDto: MakeGamePlayDto = { votes };

    this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
    setGameInContext(this.response, this);
  },
);

When(/^the sheriff delegates his role to the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the sheriff breaks the tie in votes by choosing the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the seer looks at the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the werewolves eat the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the accursed wolf-father infects the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the big bad wolf eats the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(
  /^the witch uses (?<potion1>life|death) potion on the player named (?<name1>.+?)(?: and (?<potion2>(?!\k<potion1>)(?:life|death)) potion on the player named (?<name2>.+?))?$/u,
  async function(this: CustomWorld, firstPotion: WitchPotion, firstTargetName: string, secondPotion: WitchPotion | null, secondTargetName: string | null): Promise<void> {
    const firstTarget = getPlayerWithNameOrThrow(firstTargetName, this.game, new Error("Player name not found"));
    const targets = [{ playerId: firstTarget._id, drankPotion: firstPotion }];
    if (secondTargetName !== null && secondPotion !== null) {
      const secondTarget = getPlayerWithNameOrThrow(secondTargetName, this.game, new Error("Player name not found"));
      targets.push({ playerId: secondTarget._id, drankPotion: secondPotion });
    }
    this.response = await makeGamePlayRequest({ targets }, this.game, this.app);
    setGameInContext(this.response, this);
  },
);

When(/^the witch uses (?<potion>life|death) potion on an unknown player$/u, async function(this: CustomWorld, potion: WitchPotion): Promise<void> {
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: createFakeObjectId("4c1b96d4dfe5af0ddfa19e35"), drankPotion: potion }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the witch uses (?<potion>life|death) potion on the following players$/u, async function(this: CustomWorld, potion: WitchPotion, targetsDatatable: DataTable): Promise<void> {
  const makeGamePlayDto = { targets: convertDatatableToMakeGamePlayTargets(targetsDatatable.rows(), this.game) };
  makeGamePlayDto.targets = makeGamePlayDto.targets.map(target => ({ ...target, drankPotion: potion }));

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the hunter shoots at the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(
  /^the cupid shoots an arrow at the player named (?<name>.+) and the player named (?<otherName>.+)$/u,
  async function(this: CustomWorld, targetName: string, otherTargetName: string): Promise<void> {
    const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
    const otherTarget = getPlayerWithNameOrThrow(otherTargetName, this.game, new Error("Player name not found"));
    const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }, { playerId: otherTarget._id }] };

    this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
    setGameInContext(this.response, this);
  },
);

When(/^the lovers meet each other$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the two sisters meet each other$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the three brothers meet each other$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the defender protects the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the white werewolf eats the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the pied piper charms the following players$/u, async function(this: CustomWorld, targetsDatatable: DataTable): Promise<void> {
  const makeGamePlayDto = { targets: convertDatatableToMakeGamePlayTargets(targetsDatatable.rows(), this.game) };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the scapegoat bans from vote the following players$/u, async function(this: CustomWorld, targetsDatatable: DataTable): Promise<void> {
  const makeGamePlayDto = { targets: convertDatatableToMakeGamePlayTargets(targetsDatatable.rows(), this.game) };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the charmed people meet each other$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the fox sniffs the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the wild child chooses the player named (?<name>.+) as a model$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the wolf-hound chooses the (?<chosenSide>villagers|werewolves|unknown) side$/u, async function(this: CustomWorld, chosenSide: RoleSide): Promise<void> {
  const makeGamePlayDto: MakeGamePlayDto = { chosenSide };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the (?:thief|actor) chooses card with role (?<cardRole>.+)$/u, async function(this: CustomWorld, cardRole: RoleName): Promise<void> {
  const chosenCard = this.game.additionalCards?.find(({ roleName }) => roleName === cardRole);
  this.response = await makeGamePlayRequest({ chosenCardId: chosenCard?._id }, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the (?:thief|actor) chooses an unknown card$/u, async function(this: CustomWorld): Promise<void> {
  const unknownCardId = createFakeObjectId("4c1b96d4dfe5af0ddfa19e35");
  this.response = await makeGamePlayRequest({ chosenCardId: unknownCardId }, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the scandalmonger marks the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the survivors bury dead bodies$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the devoted servant steals the role of the player named (?<name>.+)$/u, async function(this: CustomWorld, targetName: string): Promise<void> {
  const target = getPlayerWithNameOrThrow(targetName, this.game, new Error("Player name not found"));
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: target._id }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the bear tamer calms his bear$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the stuttering judge requests another vote$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({ doesJudgeRequestAnotherVote: true }, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the player or group skips his turn$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await makeGamePlayRequest({}, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the player or group targets an unknown player$/u, async function(this: CustomWorld): Promise<void> {
  const makeGamePlayDto: MakeGamePlayDto = { targets: [{ playerId: createFakeObjectId("4c1b96d4dfe5af0ddfa19e35") }] };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});

When(/^the player or group targets the following players$/u, async function(this: CustomWorld, players: DataTable): Promise<void> {
  const makeGamePlayDto = { targets: convertDatatableToMakeGamePlayTargets(players.rows(), this.game) };

  this.response = await makeGamePlayRequest(makeGamePlayDto, this.game, this.app);
  setGameInContext(this.response, this);
});