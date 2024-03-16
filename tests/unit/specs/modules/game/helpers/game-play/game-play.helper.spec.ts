import type { Types } from "mongoose";

import type { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { GamePlayActions, GamePlayCauses, WitchPotions } from "@/modules/game/enums/game-play.enum";
import { PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { areGamePlaysEqual, canSurvivorsVote, createMakeGamePlayDtoWithRelations, findPlayPriorityIndex, getChosenCardFromMakeGamePlayDto, getTargetsWithRelationsFromMakeGamePlayDto, getVotesWithRelationsFromMakeGamePlayDto, isPlayerInteractableInCurrentGamePlay, isPlayerInteractableWithInteractionTypeInCurrentGamePlay } from "@/modules/game/helpers/game-play/game-play.helper";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";
import { RoleSides } from "@/modules/role/enums/role.enum";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enum";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";

import { createFakeMakeGamePlayTargetWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-target-with-relations.dto.factory";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeMakeGamePlayWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-with-relations.dto.factory";
import { createFakeMakeGamePlayDto } from "@tests/factories/game/dto/make-game-play/make-game-play.dto.factory";
import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGamePlaySourceInteraction } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source.schema.factory";
import { createFakeGamePlay, createFakeGamePlayHunterShoots, createFakeGamePlaySeerLooks, createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayWerewolvesEat, createFakeGamePlayWhiteWerewolfEats } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCantVoteBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeHunterAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { getError } from "@tests/helpers/exception/exception.helper";

describe("Game Play Helper", () => {
  describe("getVotesWithRelationsFromMakeGamePlayDto", () => {
    it("should return undefined when votes are undefined.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto();

      expect(getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toBeUndefined();
    });

    it("should throw error when votes contains one unknown source.", async() => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const fakePlayerId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: fakePlayerId, targetId: game.players[0]._id },
        ],
      });
      const expectedError = new ResourceNotFoundException(ApiResources.PLAYERS, fakePlayerId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
      const error = await getError<ResourceNotFoundException>(() => getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game));

      expect(error).toStrictEqual<ResourceNotFoundException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Game Play - Player in `votes.source` is not in the game players" });
    });

    it("should throw error when votes contains one unknown target.", async() => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const fakePlayerId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: fakePlayerId },
        ],
      });
      const expectedError = new ResourceNotFoundException(ApiResources.PLAYERS, fakePlayerId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET);
      const error = await getError<ResourceNotFoundException>(() => getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game));

      expect(error).toStrictEqual<ResourceNotFoundException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Game Play - Player in `votes.target` is not in the game players" });
    });

    it("should fill votes with game players when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
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

    it("should throw error when targets contains one unknown player.", async() => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const fakePlayerId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        targets: [
          { playerId: game.players[0]._id },
          { playerId: game.players[1]._id },
          { playerId: fakePlayerId },
        ],
      });
      const expectedError = new ResourceNotFoundException(ApiResources.PLAYERS, fakePlayerId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_TARGET);
      const error = await getError<ResourceNotFoundException>(() => getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game));

      expect(error).toStrictEqual<ResourceNotFoundException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Game Play - Player in `targets.player` is not in the game players" });
    });

    it("should fill targets with game players when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        targets: [
          { playerId: game.players[0]._id },
          { playerId: game.players[1]._id },
          { playerId: game.players[2]._id, drankPotion: WitchPotions.DEATH },
        ],
      });
      const expectedTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] }),
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

    it("should throw error when chosen card is unknown from game cards.", async() => {
      const additionalCards = [
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
      ];
      const game = createFakeGame({ additionalCards });
      const fakeCardId = createFakeObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({ chosenCardId: fakeCardId });
      const expectedError = new ResourceNotFoundException(ApiResources.GAME_ADDITIONAL_CARDS, fakeCardId.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_CHOSEN_CARD);
      const error = await getError<ResourceNotFoundException>(() => getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game));

      expect(error).toStrictEqual<ResourceNotFoundException>(expectedError);
      expect(error).toHaveProperty("options", { description: "Game Play - Chosen card is not in the game additional cards" });
    });

    it("should return chosen card when called.", () => {
      const additionalCards = [
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
      ];
      const game = createFakeGame({ additionalCards });
      const makeGamePlayDto = createFakeMakeGamePlayDto({ chosenCardId: game.additionalCards?.[3]._id });

      expect(getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game)).toStrictEqual<GameAdditionalCard>(additionalCards[3]);
    });
  });

  describe("createMakeGamePlayDtoWithRelations", () => {
    it("should return same dto with relations when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const additionalCards = [
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
        createFakeGameAdditionalCard(),
      ];
      const game = createFakeGame({ players, additionalCards });
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: game.players[0]._id },
        ],
        targets: [
          { playerId: game.players[0]._id },
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
          { player: game.players[0] },
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

      expect(findPlayPriorityIndex(gamePlay)).toBe(1);
    });
  });

  describe("areGamePlaysEqual", () => {
    it.each<{
      test: string;
      playA: GamePlay;
      playB: GamePlay;
      expected: boolean;
    }>([
      {
        test: "should return true when both plays are equal.",
        playA: createFakeGamePlaySeerLooks(),
        playB: createFakeGamePlaySeerLooks(),
        expected: true,
      },
      {
        test: "should return false when both sources are not equal.",
        playA: createFakeGamePlayWerewolvesEat(),
        playB: createFakeGamePlayWhiteWerewolfEats(),
        expected: false,
      },
      {
        test: "should return false when both actions are not equal.",
        playA: createFakeGamePlaySurvivorsVote(),
        playB: createFakeGamePlaySurvivorsElectSheriff(),
        expected: false,
      },
      {
        test: "should return false when both causes are not equal.",
        playA: createFakeGamePlaySurvivorsVote(),
        playB: createFakeGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
        expected: false,
      },
    ])("$test", ({ playA, playB, expected }) => {
      expect(areGamePlaysEqual(playA, playB)).toBe(expected);
    });
  });

  describe("canSurvivorsVote", () => {
    it.each<{
      test: string;
      game: Game;
      expected: boolean;
    }>([
      {
        test: "should return false when all players are dead.",
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer({ isAlive: false }),
            createFakeWerewolfAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return false when all survivors has the cant-vote attribute.",
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: false,
      },
      {
        test: "should return true when at least one survivor doesn't have the cant-vote attribute.",
        game: createFakeGame({
          players: [
            createFakeHunterAlivePlayer({ attributes: [createFakeCantVoteBySurvivorsPlayerAttribute()] }),
            createFakeWerewolfAlivePlayer({ attributes: [] }),
            createFakeWerewolfAlivePlayer({ isAlive: false }),
          ],
        }),
        expected: true,
      },
    ])(`$test`, ({ game, expected }) => {
      expect(canSurvivorsVote(game)).toBe(expected);
    });
  });

  describe("isPlayerInteractableInCurrentGamePlay", () => {
    const players = [
      createFakeHunterAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
    ];

    it.each<{
      playerId: Types.ObjectId;
      game: GameWithCurrentPlay;
      expected: boolean;
      test: string;
    }>([
      {
        playerId: players[0]._id,
        game: createFakeGameWithCurrentPlay({
          players, currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({ eligibleTargets: [players[0]] }),
                createFakeGamePlaySourceInteraction({ eligibleTargets: [players[0], players[1]] }),
              ],
            }),
          }),
        }),
        expected: true,
        test: "should return true when player is in current play interactions",
      },
      {
        playerId: players[2]._id,
        game: createFakeGameWithCurrentPlay({
          players, currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({ eligibleTargets: [players[0]] }),
                createFakeGamePlaySourceInteraction({ eligibleTargets: [players[0], players[1]] }),
              ],
            }),
          }),
        }),
        expected: false,
        test: "should return false when player is not in current play interactions",
      },
    ])(`$test`, ({ playerId, game, expected }) => {
      expect(isPlayerInteractableInCurrentGamePlay(playerId, game)).toBe(expected);
    });
  });

  describe("isPlayerInteractableWithInteractionTypeInCurrentGamePlay", () => {
    const players = [
      createFakeHunterAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
    ];

    it.each<{
      playerId: Types.ObjectId;
      interactionType: PlayerInteractionTypes;
      game: GameWithCurrentPlay;
      expected: boolean;
      test: string;
    }>([
      {
        playerId: players[0]._id,
        interactionType: PlayerInteractionTypes.VOTE,
        game: createFakeGameWithCurrentPlay({
          players, currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({
                  type: PlayerInteractionTypes.SHOOT,
                  eligibleTargets: [players[0]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: PlayerInteractionTypes.VOTE,
                  eligibleTargets: [players[0], players[1]],
                }),
              ],
            }),
          }),
        }),
        expected: true,
        test: "should return true when player is in current play interactions with the given interaction type",
      },
      {
        playerId: players[2]._id,
        interactionType: PlayerInteractionTypes.VOTE,
        game: createFakeGameWithCurrentPlay({
          players, currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({
                  type: PlayerInteractionTypes.VOTE,
                  eligibleTargets: [players[0]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: PlayerInteractionTypes.VOTE,
                  eligibleTargets: [players[0], players[1]],
                }),
              ],
            }),
          }),
        }),
        expected: false,
        test: "should return false when player is not in current play interactions with the given interaction type",
      },
      {
        playerId: players[1]._id,
        interactionType: PlayerInteractionTypes.VOTE,
        game: createFakeGameWithCurrentPlay({
          players,
          currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({
                  type: PlayerInteractionTypes.LOOK,
                  eligibleTargets: [players[0], players[1]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: PlayerInteractionTypes.VOTE,
                  eligibleTargets: [players[0]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: PlayerInteractionTypes.SHOOT,
                  eligibleTargets: [players[0], players[1]],
                }),
              ],
            }),
          }),
        }),
        expected: false,
        test: "should return false when player is in current play interactions but not for the given interaction type",
      },
    ])(`$test`, ({ playerId, interactionType, game, expected }) => {
      expect(isPlayerInteractableWithInteractionTypeInCurrentGamePlay(playerId, interactionType, game)).toBe(expected);
    });
  });
});