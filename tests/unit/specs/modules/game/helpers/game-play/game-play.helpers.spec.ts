import type { Types } from "mongoose";

import type { GamePlayCause } from "@/modules/game/types/game-play/game-play.types";
import type { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { areGamePlaysEqual, canSurvivorsVote, createMakeGamePlayDtoWithRelations, doesGamePlayHaveAnyCause, doesGamePlayHaveCause, findPlayPriorityIndex, getChosenCardFromMakeGamePlayDto, getTargetsWithRelationsFromMakeGamePlayDto, getVotesWithRelationsFromMakeGamePlayDto, isPlayerInteractableInCurrentGamePlay, isPlayerInteractableWithInteractionTypeInCurrentGamePlay } from "@/modules/game/helpers/game-play/game-play.helpers";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";
import type { PlayerInteractionType } from "@/modules/game/types/player/player-interaction/player-interaction.types";

import { ApiResources } from "@/shared/api/enums/api.enums";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enums";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";

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
import { getError } from "@tests/helpers/exception/exception.helpers";

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
          { playerId: game.players[2]._id, drankPotion: "death" },
        ],
      });
      const expectedTargets = [
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[0] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[1] }),
        createFakeMakeGamePlayTargetWithRelationsDto({ player: game.players[2], drankPotion: "death" }),
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
          { playerId: game.players[2]._id, drankPotion: "death" },
        ],
        chosenCardId: game.additionalCards?.[3]._id,
        doesJudgeRequestAnotherVote: true,
        chosenSide: "werewolves",
      });
      const expectedMakeGamePlayDtoWithRelationsDto = createFakeMakeGamePlayWithRelationsDto({
        votes: [
          { source: game.players[0], target: game.players[1] },
          { source: game.players[1], target: game.players[0] },
        ],
        targets: [
          { player: game.players[0] },
          { player: game.players[1] },
          { player: game.players[2], drankPotion: "death" },
        ],
        chosenCard: game.additionalCards?.[3],
        doesJudgeRequestAnotherVote: true,
        chosenSide: "werewolves",
      });

      expect(createMakeGamePlayDtoWithRelations(makeGamePlayDto, game)).toStrictEqual<MakeGamePlayWithRelationsDto>(expectedMakeGamePlayDtoWithRelationsDto);
    });
  });

  describe("findPlayPriorityIndex", () => {
    it("should return -1 when play is not found in priority list.", () => {
      const gamePlay = createFakeGamePlaySeerLooks({ action: "eat" });

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
        playB: createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] }),
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
          players,
          currentPlay: createFakeGamePlay({
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
          players,
          currentPlay: createFakeGamePlay({
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
      interactionType: PlayerInteractionType;
      game: GameWithCurrentPlay;
      expected: boolean;
      test: string;
    }>([
      {
        playerId: players[0]._id,
        interactionType: "vote",
        game: createFakeGameWithCurrentPlay({
          players,
          currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({
                  type: "shoot",
                  eligibleTargets: [players[0]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: "vote",
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
        interactionType: "vote",
        game: createFakeGameWithCurrentPlay({
          players,
          currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({
                  type: "vote",
                  eligibleTargets: [players[0]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: "vote",
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
        interactionType: "vote",
        game: createFakeGameWithCurrentPlay({
          players,
          currentPlay: createFakeGamePlay({
            source: createFakeGamePlaySource({
              interactions: [
                createFakeGamePlaySourceInteraction({
                  type: "look",
                  eligibleTargets: [players[0], players[1]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: "vote",
                  eligibleTargets: [players[0]],
                }),
                createFakeGamePlaySourceInteraction({
                  type: "shoot",
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

  describe("doesGamePlayHaveCause", () => {
    it.each<{
      gamePlay: GamePlay;
      cause: GamePlayCause;
      expected: boolean;
      test: string;
    }>([
      {
        gamePlay: createFakeGamePlaySurvivorsVote(),
        cause: "previous-votes-were-in-ties",
        expected: false,
        test: "should return false when game play doesn't have any cause at all.",
      },
      {
        gamePlay: createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] }),
        cause: "previous-votes-were-in-ties",
        expected: true,
        test: "should return true when game play has the cause.",
      },
      {
        gamePlay: createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] }),
        cause: "angel-presence",
        expected: false,
        test: "should return false when game play doesn't have the cause.",
      },
    ])(`$test`, ({ gamePlay, cause, expected }) => {
      expect(doesGamePlayHaveCause(gamePlay, cause)).toBe(expected);
    });
  });

  describe("doesGamePlayHaveAnyCause", () => {
    it.each<{
      gamePlay: GamePlay;
      causes: GamePlayCause[];
      expected: boolean;
      test: string;
    }>([
      {
        gamePlay: createFakeGamePlaySurvivorsVote(),
        causes: ["previous-votes-were-in-ties"],
        expected: false,
        test: "should return false when game play doesn't have any of the causes.",
      },
      {
        gamePlay: createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] }),
        causes: ["previous-votes-were-in-ties"],
        expected: true,
        test: "should return true when game play has all of the causes.",
      },
      {
        gamePlay: createFakeGamePlaySurvivorsVote({ causes: ["previous-votes-were-in-ties"] }),
        causes: ["previous-votes-were-in-ties", "angel-presence"],
        expected: true,
        test: "should return true when game play has any of the causes.",
      },
    ])(`$test`, ({ gamePlay, causes, expected }) => {
      expect(doesGamePlayHaveAnyCause(gamePlay, causes)).toBe(expected);
    });
  });
});