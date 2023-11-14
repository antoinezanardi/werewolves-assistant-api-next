import type { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerGroups, PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { areGamePlaysEqual, canSurvivorsVote, createMakeGamePlayDtoWithRelations, findPlayPriorityIndex, getChosenCardFromMakeGamePlayDto, getTargetsWithRelationsFromMakeGamePlayDto, getVotesWithRelationsFromMakeGamePlayDto, isPlayerInteractableWithInteractionType } from "@/modules/game/helpers/game-play/game-play.helper";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";

import { createFakeMakeGamePlayTargetWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeMakeGamePlayDto } from "@tests/factories/game/dto/make-game-play/make-game-play.dto.factory";
import { bulkCreateFakeGameAdditionalCards } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGamePlayEligibleTargets } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets.schema.factory";
import { createFakeInteractablePlayer } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/interactable-player.schema.factory";
import { createFakePlayerInteraction } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/player-interaction/player-interaction.schema.factory";
import { createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayHunterShoots, createFakeGamePlaySeerLooks, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats, createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeHunterAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

jest.mock("@/shared/exception/types/resource-not-found-exception.type");

describe("Game Play Helper", () => {
  describe("getVotesWithRelationsFromMakeGamePlayDto", () => {
    it("should return undefined when votes are undefined.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto();

      expect(getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toBeUndefined();
    });

    it("should throw error when votes contains one unknown source.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4) });
      const fakePlayerId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: fakePlayerId, targetId: game.players[0]._id },
        ],
      });

      expect(() => getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(ResourceNotFoundException);
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(ApiResources.PLAYERS, fakePlayerId.toString(), "Game Play - Player in `votes.source` is not in the game players");
    });

    it("should throw error when votes contains one unknown target.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4) });
      const fakePlayerId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: fakePlayerId },
        ],
      });

      expect(() => getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(ResourceNotFoundException);
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(ApiResources.PLAYERS, fakePlayerId.toString(), "Game Play - Player in `votes.target` is not in the game players");
    });

    it("should fill votes with game players when called.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4) });
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: game.players[0]._id },
        ],
      });
      const votes = getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game);
      const expectedVotes = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[0], target: game.players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: game.players[1], target: game.players[0] }),
      ];

      expect(votes).toStrictEqual<MakeGamePlayVoteWithRelationsDto[]>(expectedVotes);
    });
  });

  describe("getTargetsWithRelationsFromMakeGamePlayDto", () => {
    it("should return undefined when targets are undefined.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto();

      expect(getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toBeUndefined();
    });

    it("should throw error when targets contains one unknown player.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4) });
      const fakePlayerId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        targets: [
          { playerId: game.players[0]._id },
          { playerId: game.players[1]._id },
          { playerId: fakePlayerId },
        ],
      });

      expect(() => getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(ResourceNotFoundException);
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(ApiResources.PLAYERS, fakePlayerId.toString(), "Game Play - Player in `targets.player` is not in the game players");
    });

    it("should fill targets with game players when called.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4) });
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        targets: [
          { playerId: game.players[0]._id, isInfected: true },
          { playerId: game.players[1]._id },
          { playerId: game.players[2]._id, drankPotion: WitchPotions.DEATH },
        ],
      });
      const expectedTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0], isInfected: true }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[2], drankPotion: WitchPotions.DEATH }),
      ];

      expect(getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toStrictEqual<MakeGamePlayTargetWithRelationsDto[]>(expectedTargets);
    });
  });

  describe("getChosenCardFromMakeGamePlayDto", () => {
    it("should return undefined when chosenCardId is undefined.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto();

      expect(getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game)).toBeUndefined();
    });

    it("should throw error when chosen card is unknown from game cards.", () => {
      const game = createFakeGame({ additionalCards: bulkCreateFakeGameAdditionalCards(4) });
      const fakeCardId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({ chosenCardId: fakeCardId });

      expect(() => getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(ResourceNotFoundException);
      expect(ResourceNotFoundException).toHaveBeenCalledExactlyOnceWith(ApiResources.GAME_ADDITIONAL_CARDS, fakeCardId.toString(), "Game Play - Chosen card is not in the game additional cards");
    });

    it("should return chosen card when called.", () => {
      const game = createFakeGame({ additionalCards: bulkCreateFakeGameAdditionalCards(4) });
      const makeGamePlayDto = createFakeMakeGamePlayDto({ chosenCardId: game.additionalCards?.[3]._id });

      expect(getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game)).toStrictEqual(game.additionalCards?.[3]);
    });
  });

  describe("createMakeGamePlayDtoWithRelations", () => {
    it("should return same dto with relations when called.", () => {
      const game = createFakeGame({ players: bulkCreateFakePlayers(4), additionalCards: bulkCreateFakeGameAdditionalCards(4) });
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: game.players[0]._id },
        ],
        targets: [
          { playerId: game.players[0]._id, isInfected: true },
          { playerId: game.players[1]._id },
          { playerId: game.players[2]._id, drankPotion: WitchPotions.DEATH },
        ],
        chosenCardId: game.additionalCards?.[3]._id,
        doesJudgeRequestAnotherVote: true,
        chosenSide: RoleSides.WEREWOLVES,
      });
      const expectedMakeGamePlayDtoWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({
        votes: [
          { source: game.players[0], target: game.players[1] },
          { source: game.players[1], target: game.players[0] },
        ],
        targets: [
          { player: game.players[0], isInfected: true },
          { player: game.players[1] },
          { player: game.players[2], drankPotion: WitchPotions.DEATH },
        ],
        chosenCard: game.additionalCards?.[3],
        doesJudgeRequestAnotherVote: true,
        chosenSide: RoleSides.WEREWOLVES,
      });

      expect(createMakeGamePlayDtoWithRelations(makeGamePlayDto, game)).toStrictEqual<MakeGamePlayWithRelationsDto>(expectedMakeGamePlayDtoWithRelationsDto);
    });
  });

  describe("findPlayPriorityIndex", () => {
    it("should return -1 when play is not found in priority list.", () => {
      const gamePlay = createFakeGamePlaySeerLooks({ action: GamePlayActions.EAT });

      expect(findPlayPriorityIndex(gamePlay)).toBe(-1);
    });

    it("should return index when play is found in priority list.", () => {
      const gamePlay = createFakeGamePlayHunterShoots();

      expect(findPlayPriorityIndex(gamePlay)).toBe(0);
    });
  });

  describe("areGamePlaysEqual", () => {
    it.each<{ playA: GamePlay; playB: GamePlay; result: boolean; test: string }>([
      {
        playA: createFakeGamePlaySeerLooks(),
        playB: createFakeGamePlaySeerLooks(),
        result: true,
        test: "both plays are equal",
      },
      {
        playA: createFakeGamePlayWerewolvesEat(),
        playB: createFakeGamePlayWhiteWerewolfEats(),
        result: false,
        test: "both sources are not equal",
      },
      {
        playA: createFakeGamePlaySurvivorsVote(),
        playB: createFakeGamePlaySurvivorsElectSheriff(),
        result: false,
        test: "both actions are not equal",
      },
      {
        playA: createFakeGamePlaySurvivorsVote(),
        playB: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
        result: false,
        test: "both causes are not equal",
      },
    ])("should return $result when $test [#$#].", ({ playA, playB, result }) => {
      expect(areGamePlaysEqual(playA, playB)).toBe(result);
    });
  });

  describe("canSurvivorsVote", () => {
    it.each<{ game: Game; expectedResult: boolean; test: string }>([
      {
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer({ isAlive: false }),
            createFakeWerewolfAlivePlayer({ isAlive: false }),
          ],
        }),
        expectedResult: false,
        test: "all players are dead",
      },
      {
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ isAlive: false }),
          ],
        }),
        expectedResult: false,
        test: "all survivors has the cant-vote attribute",
      },
      {
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ attributes: [] }),
            createFakeWerewolfAlivePlayer({ isAlive: false }),
          ],
        }),
        expectedResult: true,
        test: "at least one survivor doesn't have the cant-vote attribute",
      },
    ])(`should return $expectedResult when $test [#$#].`, ({ game, expectedResult }) => {
      expect(canSurvivorsVote(game)).toBe(expectedResult);
    });
  });

  describe("isPlayerInteractableWithInteractionType", () => {
    it("should return false when player is not found.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const eligibleTargets = createFakeGamePlayEligibleTargets({ interactablePlayers: [createFakeInteractablePlayer({ player: players[1] })] });
      const currentPlay = createFakeGamePlay({ eligibleTargets });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const interactionType = PlayerInteractionTypes.EAT;

      expect(isPlayerInteractableWithInteractionType(players[0]._id, interactionType, game)).toBe(false);
    });

    it("should return false when interaction for player is not found.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const badInteraction = createFakePlayerInteraction({
        type: PlayerInteractionTypes.CHARM,
        source: RoleNames.PIED_PIPER,
      });
      const goodInteraction = createFakePlayerInteraction({
        type: PlayerInteractionTypes.EAT,
        source: PlayerGroups.WEREWOLVES,
      });
      const eligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: [
          createFakeInteractablePlayer({ player: players[0], interactions: [badInteraction] }),
          createFakeInteractablePlayer({ player: players[1], interactions: [goodInteraction] }),
        ],
      });
      const currentPlay = createFakeGamePlay({ eligibleTargets });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const interactionType = PlayerInteractionTypes.EAT;

      expect(isPlayerInteractableWithInteractionType(players[0]._id, interactionType, game)).toBe(false);
    });

    it("should return false when interaction for player is found.", () => {
      const players = [
        createFakeHunterAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const badInteraction = createFakePlayerInteraction({
        type: PlayerInteractionTypes.CHARM,
        source: RoleNames.PIED_PIPER,
      });
      const goodInteraction = createFakePlayerInteraction({
        type: PlayerInteractionTypes.EAT,
        source: PlayerGroups.WEREWOLVES,
      });
      const eligibleTargets = createFakeGamePlayEligibleTargets({
        interactablePlayers: [
          createFakeInteractablePlayer({ player: players[0], interactions: [goodInteraction] }),
          createFakeInteractablePlayer({ player: players[1], interactions: [badInteraction] }),
        ],
      });
      const currentPlay = createFakeGamePlay({ eligibleTargets });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay });
      const interactionType = PlayerInteractionTypes.EAT;

      expect(isPlayerInteractableWithInteractionType(players[0]._id, interactionType, game)).toBe(true);
    });
  });
});