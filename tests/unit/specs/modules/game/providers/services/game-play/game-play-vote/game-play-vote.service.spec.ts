import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";

import type { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { PlayerVoteCount } from "@/modules/game/types/game-play.type";

import { createFakeMakeGamePlayVoteWithRelationsDto } from "@tests/factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeScandalmongerGameOptions, createFakeRolesGameOptions, createFakeSheriffGameOptions } from "@tests/factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlaySurvivorsElectSheriff, createFakeGamePlaySurvivorsVote, createFakeGamePlayFoxSniffs } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakePowerlessByElderPlayerAttribute, createFakeScandalmongerMarkedByScandalmongerPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeElderAlivePlayer, createFakeFoxAlivePlayer, createFakeScandalmongerAlivePlayer, createFakeWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";

describe("Game Play Vote Service", () => {
  let services: { gamePlayVote: GamePlayVoteService };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GamePlayVoteService] }).compile();

    services = { gamePlayVote: module.get<GamePlayVoteService>(GamePlayVoteService) };
  });

  describe("getNominatedPlayers", () => {
    it("should get nominated players when called.", () => {
      const players: Player[] = [
        createFakeElderAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const sheriffOptions = createFakeSheriffGameOptions({ hasDoubledVote: true });
      const scandalmongerOptions = createFakeScandalmongerGameOptions({ markPenalty: 2 });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: sheriffOptions, scandalmonger: scandalmongerOptions }) });
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
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });

      expect(services.gamePlayVote["getPlayerVoteCounts"](undefined, game)).toStrictEqual<PlayerVoteCount[]>([]);
    });

    it("should get player vote counts with only simple votes when there is no sheriff.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
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
        createFakeElderAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
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
        createFakeElderAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
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
        createFakeElderAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
        createFakeScandalmongerAlivePlayer(),
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
  
  describe("addScandalmongerMarkVoteToPlayerVoteCounts", () => {
    it("should return player vote counts as is when action is not vote.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayFoxSniffs() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when there is no scandalmonger player in the game.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeFoxAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when scandalmonger player is not alive.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when scandalmonger player is powerless.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer({ attributes: [createFakePowerlessByElderPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when there are no scandalmonger mark.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when the scandalmonger target is dead.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false, attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts with new player vote entry when scandalmonger target doesn't have vote.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ scandalmonger: createFakeScandalmongerGameOptions({ markPenalty: 2 }) }) });
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

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(expectedPlayerVoteCounts);
    });

    it("should return player vote counts with updated player vote entry when scandalmonger target already has votes.", () => {
      const players = [
        createFakeElderAlivePlayer(),
        createFakeScandalmongerAlivePlayer({ attributes: [createFakeScandalmongerMarkedByScandalmongerPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ scandalmonger: createFakeScandalmongerGameOptions({ markPenalty: 5 }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlaySurvivorsVote(), options });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];
      const expectedPlayerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 7],
      ];

      expect(services.gamePlayVote["addScandalmongerMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(expectedPlayerVoteCounts);
    });
  });
});