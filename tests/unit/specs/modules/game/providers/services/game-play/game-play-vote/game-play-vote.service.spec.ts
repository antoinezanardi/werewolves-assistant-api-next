import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../../../../../../../src/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import { GamePlayVoteService } from "../../../../../../../../../src/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import type { Player } from "../../../../../../../../../src/modules/game/schemas/player/player.schema";
import type { PlayerVoteCount } from "../../../../../../../../../src/modules/game/types/game-play.type";
import { createFakeMakeGamePlayVoteWithRelationsDto } from "../../../../../../../../factories/game/dto/make-game-play/make-game-play-with-relations/make-game-play-vote-with-relations.dto.factory";
import { createFakeGameOptions } from "../../../../../../../../factories/game/schemas/game-options/game-options.schema.factory";
import { createFakeRavenGameOptions, createFakeRolesGameOptions, createFakeSheriffGameOptions } from "../../../../../../../../factories/game/schemas/game-options/game-roles-options.schema.factory";
import { createFakeGamePlayAllElectSheriff, createFakeGamePlayAllVote, createFakeGamePlayFoxSniffs } from "../../../../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameWithCurrentPlay } from "../../../../../../../../factories/game/schemas/game.schema.factory";
import { createFakePowerlessByAncientPlayerAttribute, createFakeRavenMarkedByRavenPlayerAttribute, createFakeSheriffByAllPlayerAttribute } from "../../../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeAncientAlivePlayer, createFakeFoxAlivePlayer, createFakeRavenAlivePlayer, createFakeWerewolfAlivePlayer } from "../../../../../../../../factories/game/schemas/player/player-with-role.schema.factory";

describe("Game Play Vote Service", () => {
  let services: { gamePlayVote: GamePlayVoteService };

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [GamePlayVoteService] }).compile();

    services = { gamePlayVote: module.get<GamePlayVoteService>(GamePlayVoteService) };
  });

  describe("getNominatedPlayers", () => {
    it("should get nominated players when called.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const sheriffOptions = createFakeSheriffGameOptions({ hasDoubledVote: true });
      const ravenOptions = createFakeRavenGameOptions({ markPenalty: 2 });
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: sheriffOptions, raven: ravenOptions }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote(), options });
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
    it("should get player vote counts with only simple votes when there is no sheriff.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote(), options });
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
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: false }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote(), options });
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
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllElectSheriff(), options });
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
      const players: Player[] = [
        createFakeAncientAlivePlayer({ attributes: [createFakeSheriffByAllPlayerAttribute()] }),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ sheriff: createFakeSheriffGameOptions({ hasDoubledVote: true }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote(), options });
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
      const players: Player[] = [
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
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeFoxAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when raven player is not alive.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when raven player is powerless.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ attributes: [createFakePowerlessByAncientPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when there are no raven mark.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts as is when the raven target is dead.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false, attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote() });
      const playerVoteCounts: PlayerVoteCount[] = [
        [players[0], 1],
        [players[1], 2],
      ];

      expect(services.gamePlayVote["addRavenMarkVoteToPlayerVoteCounts"](playerVoteCounts, game)).toStrictEqual<PlayerVoteCount[]>(playerVoteCounts);
    });

    it("should return player vote counts with new player vote entry when raven target doesn't have vote.", () => {
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer(),
        createFakeWerewolfAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ raven: createFakeRavenGameOptions({ markPenalty: 2 }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote(), options });
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
      const players: Player[] = [
        createFakeAncientAlivePlayer(),
        createFakeRavenAlivePlayer({ attributes: [createFakeRavenMarkedByRavenPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ];
      const options = createFakeGameOptions({ roles: createFakeRolesGameOptions({ raven: createFakeRavenGameOptions({ markPenalty: 5 }) }) });
      const game = createFakeGameWithCurrentPlay({ players, currentPlay: createFakeGamePlayAllVote(), options });
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