import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";

import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { PlayerVoteCount } from "@/modules/game/types/game-play.type";

import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRavenGameOptions, createFakeRolesGameOptions, createFakeSheriffGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayFoxSniffs } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePowerlessByAncientPlayerAttribute, createFakeRavenMarkedByRavenPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAncientAlivePlayer, createFakeFoxAlivePlayer, createFakeRavenAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";

describe("Game Play Vote Service", () => {
  let services: { gamePlayVote: GamePlayVoteService };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GamePlayVoteService] }).compile();

    services = { gamePlayVote: module.get<GamePlayVoteService>(GamePlayVoteService) };
  });

  describe("getNominatedPlayers", () => {
    it("should get nominated players when called.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const sheriffOptions = createFakeSheriffGameOptions({ hasDoubledVote: true });
      const ravenOptions = createFakeRavenGameOptions({ markPenalty: 2 });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: sheriffOptions, raven: ravenOptions }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedNominatedPlayers = [
        players[1],
        players[2],
      ];

      expect(services.gamePlayVote.getNominatedPlayers(votes, game)).toContainAllValues<Player>(expectedNominatedPlayers);
    });
  });
  
  describe("getPlayerVoteCounts", () => {
    it("should return empty array when votes are undefined.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });

      expect(services.gamePlayVote["getPlayerVoteCounts"](undefined, game)).toStrictEqual<PlayerVoteCount[]>([]);
    });

    it("should get player vote counts with only simple votes when there is no sheriff.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[0], 2],
        [players[1], 1],
      ];

      expect(services.gamePlayVote["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });

    it("should get player vote counts with only simple votes when sheriff doesn't have double vote.", () => {
      const players = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: false }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[1], 1],
        [players[0], 2],
      ];

      expect(services.gamePlayVote["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });

    it("should get player vote counts with simple only votes when game play is not vote.", () => {
      const players = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsElectSheriff(), options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[1], 1],
        [players[0], 2],
      ];

      expect(services.gamePlayVote["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });

    it("should get player vote counts with simple votes and one doubled vote when sheriff has double vote.", () => {
      const players = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const votes: MakeGamePlayVoteWithRelationsDto[] = [
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[0], target: players[1] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[1], target: players[0] }),
        createFakeMakeGamePlayVoteWithRelationsDto({ source: players[2], target: players[0] }),
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[1], 2],
        [players[0], 2],
      ];

      expect(services.gamePlayVote["getPlayerVoteCounts"](votes, game)).toContainAllValues<PlayerVoteCount>(expectedPlayerVoteCounts);
    });
  });
  
  describe("addRavenMarkVoteToPlayerVoteCounts", () => {
    it("should return player vote counts as is when action is not vote.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayFoxSniffs() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when there is no raven player in the game.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeFoxAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when raven player is not alive.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when raven player is powerless.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when there are no raven mark.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when the raven target is dead.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false, attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts with new player vote entry when raven target doesn't have vote.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ raven: createFakeRavenGameOptions({ markPenalty: 2 }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
        [players[2], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(expectedPlayerVoteCounts);
    });

    it("should return player vote counts with updated player vote entry when raven target already has votes.", () => {
      const players = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ raven: createFakeRavenGameOptions({ markPenalty: 5 }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 7],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(expectedPlayerVoteCounts);
    });
  });
});