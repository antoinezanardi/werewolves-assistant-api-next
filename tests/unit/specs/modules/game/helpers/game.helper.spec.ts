import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { areAllPlayersDead, areAllVillagersAlive, areAllWerewolvesAlive, getAdditionalCardWithId, getAlivePlayers, getAliveVillagerSidedPlayers, getAliveWerewolfSidedPlayers, getExpectedPlayersToPlay, getFoxSniffedPlayers, getGroupOfPlayers, getLeftToCharmByPiedPiperPlayers, getLeftToEatByWerewolvesPlayers, getLeftToEatByWhiteWerewolfPlayers, getNearestAliveNeighbor, getNonexistentPlayer, getNonexistentPlayerId, getPlayerDtoWithRole, getPlayersWithActiveAttributeName, getPlayersWithCurrentRole, getPlayersWithCurrentSide, getPlayerWithActiveAttributeName, getPlayerWithCurrentRole, getPlayerWithId, getPlayerWithIdOrThrow, getPlayerWithName, getPlayerWithNameOrThrow, isGameSourceGroup, isGameSourceRole } from "@/modules/game/helpers/game.helper";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GetNearestPlayerOptions } from "@/modules/game/types/game.type";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import type { ExceptionInterpolations } from "@/shared/exception/types/exception.type";
import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import * as UnexpectedExceptionFactory from "@/shared/exception/helpers/unexpected-exception.factory";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

import { bulkCreateFakeCreateGamePlayerDto } from "@tests/factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { createFakeCreateGameDto } from "@tests/factories/game/dto/create-game/create-game.dto.factory";
import { bulkCreateFakeGameAdditionalCards } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGamePlayHunterShoots, createFakeGamePlayScapegoatBansVoting, createFakeGamePlaySheriffDelegates, createFakeGamePlaySheriffSettlesVotes, createFakeGamePlayTwoSistersMeetEachOther, createFakeGamePlayWerewolvesEat } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeHunterAlivePlayer, createFakePiedPiperAlivePlayer, createFakeScapegoatAlivePlayer, createFakeSeerAlivePlayer, createFakeTwoSistersAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game Helper", () => {
  let mocks: {
    unexpectedExceptionFactory: {
      createNoCurrentGamePlayUnexpectedException: jest.SpyInstance;
    };
  };
  
  beforeEach(() => {
    mocks = { unexpectedExceptionFactory: { createNoCurrentGamePlayUnexpectedException: jest.spyOn(UnexpectedExceptionFactory, "createNoCurrentGamePlayUnexpectedException").mockImplementation() } };
  });
  
  describe("getPlayerDtoWithRole", () => {
    const players = bulkCreateFakeCreateGamePlayerDto(6, [
      { role: { name: RoleNames.WITCH } },
      { role: { name: RoleNames.SEER } },
      { role: { name: RoleNames.WEREWOLF } },
      { role: { name: RoleNames.TWO_SISTERS } },
      { role: { name: RoleNames.TWO_SISTERS } },
      { role: { name: RoleNames.IDIOT } },
    ]);
    const game = createFakeCreateGameDto({ players });

    it("should return player with role when a player has this role.", () => {
      expect(getPlayerDtoWithRole(game, RoleNames.WEREWOLF)).toStrictEqual(game.players[2]);
    });

    it("should return undefined when player with role is not found.", () => {
      expect(getPlayerDtoWithRole(game, RoleNames.THREE_BROTHERS)).toBeUndefined();
    });
  });

  describe("getPlayerWithCurrentRole", () => {
    const players = bulkCreateFakePlayers(6, [
      { role: { current: RoleNames.WITCH, original: RoleNames.WITCH, isRevealed: false } },
      { role: { current: RoleNames.SEER, original: RoleNames.SEER, isRevealed: false } },
      { role: { current: RoleNames.WEREWOLF, original: RoleNames.WEREWOLF, isRevealed: false } },
      { role: { current: RoleNames.TWO_SISTERS, original: RoleNames.TWO_SISTERS, isRevealed: false } },
      { role: { current: RoleNames.TWO_SISTERS, original: RoleNames.TWO_SISTERS, isRevealed: false } },
      { role: { current: RoleNames.IDIOT, original: RoleNames.IDIOT, isRevealed: false } },
    ]);
    const game = createFakeGame({ players });

    it("should return player with role when a player has this role.", () => {
      expect(getPlayerWithCurrentRole(game, RoleNames.SEER)).toStrictEqual(players[1]);
    });

    it("should return undefined when player with role is not found.", () => {
      expect(getPlayerWithCurrentRole(game, RoleNames.BIG_BAD_WOLF)).toBeUndefined();
    });
  });

  describe("getPlayersWithCurrentRole", () => {
    const players = bulkCreateFakePlayers(6, [
      { role: { current: RoleNames.THREE_BROTHERS, original: RoleNames.WITCH, isRevealed: false } },
      { role: { current: RoleNames.THREE_BROTHERS, original: RoleNames.SEER, isRevealed: false } },
      { role: { current: RoleNames.THREE_BROTHERS, original: RoleNames.WEREWOLF, isRevealed: false } },
      { role: { current: RoleNames.TWO_SISTERS, original: RoleNames.TWO_SISTERS, isRevealed: false } },
      { role: { current: RoleNames.TWO_SISTERS, original: RoleNames.TWO_SISTERS, isRevealed: false } },
      { role: { current: RoleNames.IDIOT, original: RoleNames.IDIOT, isRevealed: false } },
    ]);
    const game = createFakeGame({ players });

    it("should return players when they have this role.", () => {
      expect(getPlayersWithCurrentRole(game, RoleNames.THREE_BROTHERS)).toStrictEqual([players[0], players[1], players[2]]);
    });

    it("should return empty array when no one has the role.", () => {
      expect(getPlayersWithCurrentRole(game, RoleNames.WEREWOLF)).toStrictEqual([]);
    });
  });

  describe("getPlayersWithCurrentSide", () => {
    const players = bulkCreateFakePlayers(6, [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
    ]);
    const game = createFakeGame({ players });

    it("should return werewolves when they have this side.", () => {
      expect(getPlayersWithCurrentSide(game, RoleSides.WEREWOLVES)).toStrictEqual([players[0], players[1], players[4], players[5]]);
    });

    it("should return villagers when they have this side.", () => {
      expect(getPlayersWithCurrentSide(game, RoleSides.VILLAGERS)).toStrictEqual([players[2], players[3]]);
    });
  });

  describe("getPlayerWithId", () => {
    it("should get player with specific id when called with this id.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      
      expect(getPlayerWithId(game, players[2]._id)).toStrictEqual(players[2]);
    });
    
    it("should return undefined when called with unknown id.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      
      expect(getPlayerWithId(game, createFakeObjectId())).toBeUndefined();
    });
  });

  describe("getPlayerWithIdOrThrow", () => {
    it("should get player with specific id when called with this id.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      const exceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: players[2]._id.toString() };
      const exception = new UnexpectedException("killPlayer", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);
      
      expect(getPlayerWithIdOrThrow(players[2]._id, game, exception)).toStrictEqual(players[2]);
    });

    it("should throw error when called with unknown id.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      const unknownPlayerId = createFakeObjectId();
      const exceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: unknownPlayerId.toString() };
      const exception = new UnexpectedException("killPlayer", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);
      
      expect(() => getPlayerWithIdOrThrow(unknownPlayerId, game, exception)).toThrow(exception);
    });
  });

  describe("getPlayerWithName", () => {
    it("should get player with specific name when called with this name.", () => {
      const players = [
        createFakePlayer({ name: "player1" }),
        createFakePlayer({ name: "player2" }),
        createFakePlayer({ name: "player3" }),
        createFakePlayer({ name: "player4" }),
        createFakePlayer({ name: "player5" }),
      ];
      const game = createFakeGame({ players });

      expect(getPlayerWithName(game, "player3")).toStrictEqual(players[2]);
    });

    it("should return undefined when called with unknown name.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });

      expect(getPlayerWithName(game, "i-cant-be-a-valid-name-that-is-bad")).toBeUndefined();
    });
  });

  describe("getPlayerWithNameOrThrow", () => {
    it("should get player with specific name when called with this id.", () => {
      const players = [
        createFakePlayer({ name: "player1" }),
        createFakePlayer({ name: "player2" }),
        createFakePlayer({ name: "player5" }),
        createFakePlayer({ name: "player3" }),
        createFakePlayer({ name: "player4" }),
        createFakePlayer({ name: "player6" }),
      ];
      const game = createFakeGame({ players });
      const error = new Error("Can't find player with name…");

      expect(getPlayerWithNameOrThrow("player5", game, error)).toStrictEqual(players[2]);
    });

    it("should throw error when called with unknown name.", () => {
      const players = [
        createFakePlayer({ name: "player1" }),
        createFakePlayer({ name: "player2" }),
        createFakePlayer({ name: "player5" }),
        createFakePlayer({ name: "player3" }),
        createFakePlayer({ name: "player4" }),
        createFakePlayer({ name: "player6" }),
      ];
      const game = createFakeGame({ players });
      const unknownPlayerName = "i-cant-be-a-valid-name-that-is-bad";
      const error = new Error(`Can't find player with name "${unknownPlayerName}" in game "${game._id.toString()}"`);

      expect(() => getPlayerWithNameOrThrow(unknownPlayerName, game, error)).toThrow(error);
    });
  });

  describe("getAdditionalCardWithId", () => {
    it("should get card with specific id when called with this id.", () => {
      const cards = bulkCreateFakeGameAdditionalCards(6);
      
      expect(getAdditionalCardWithId(cards, cards[3]._id)).toStrictEqual(cards[3]);
    });

    it("should return undefined when cards are undefined.", () => {
      expect(getAdditionalCardWithId(undefined, createFakeObjectId())).toBeUndefined();
    });

    it("should return undefined when called with unknown id.", () => {
      const cards = bulkCreateFakeGameAdditionalCards(6);
      
      expect(getAdditionalCardWithId(cards, createFakeObjectId())).toBeUndefined();
    });
  });

  describe("areAllWerewolvesAlive", () => {
    const players = bulkCreateFakePlayers(6, [
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
    ]);
    const game = createFakeGame({ players });

    it("should return false when empty array is provided.", () => {
      expect(areAllWerewolvesAlive(createFakeGame())).toBe(false);
    });

    it("should return true when all werewolves are alive.", () => {
      expect(areAllWerewolvesAlive(game)).toBe(true);
    });

    it("should return true when at least one werewolf is dead.", () => {
      const notAllAlivePlayers = players.map(player => createFakePlayer(player));
      notAllAlivePlayers[0].isAlive = false;
      const notAllAliveGame = createFakeGame({ players: notAllAlivePlayers });
      
      expect(areAllWerewolvesAlive(notAllAliveGame)).toBe(false);
    });
  });

  describe("areAllVillagersAlive", () => {
    const players = bulkCreateFakePlayers(4, [
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
    ]);
    const game = createFakeGame({ players });

    it("should return false when empty array is provided.", () => {
      expect(areAllVillagersAlive(createFakeGame())).toBe(false);
    });

    it("should return true when all villagers are alive.", () => {
      expect(areAllVillagersAlive(game)).toBe(true);
    });

    it("should return true when at least one villager is dead.", () => {
      const notAllAlivePlayers = players.map(player => createFakePlayer(player));
      notAllAlivePlayers[1].isAlive = false;
      const notAllAliveGame = createFakeGame({ players: notAllAlivePlayers });
      
      expect(areAllVillagersAlive(notAllAliveGame)).toBe(false);
    });
  });

  describe("areAllPlayersDead", () => {
    const players = bulkCreateFakePlayers(4, [
      createFakePlayer({ isAlive: false }),
      createFakePlayer({ isAlive: false }),
      createFakePlayer({ isAlive: true }),
      createFakePlayer({ isAlive: false }),
    ]);
    const game = createFakeGame({ players });

    it("should return false when empty array is provided.", () => {
      expect(areAllPlayersDead(createFakeGame())).toBe(false);
    });

    it("should return false when at least one player is alive.", () => {
      expect(areAllPlayersDead(game)).toBe(false);
    });

    it("should return true when all players are dead.", () => {
      game.players[2].isAlive = false;
      
      expect(areAllPlayersDead(game)).toBe(true);
    });
  });

  describe("getPlayerWithActiveAttributeName", () => {
    it("should return first player with attribute when called.", () => {
      const players = bulkCreateFakePlayers(4, [
        { attributes: [] },
        { attributes: [createFakeEatenByWerewolvesPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      ]);
      const game = createFakeGame({ players });

      expect(getPlayerWithActiveAttributeName(game, PlayerAttributeNames.CHARMED)).toStrictEqual<Player>(players[2]);
    });

    it("should return undefined when player with attribute is not found.", () => {
      const players = bulkCreateFakePlayers(4, [
        { attributes: [] },
        { attributes: [createFakeEatenByWerewolvesPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      ]);
      const game = createFakeGame({ players });

      expect(getPlayerWithActiveAttributeName(game, PlayerAttributeNames.SEEN)).toBeUndefined();
    });
  });

  describe("getPlayersWithActiveAttributeName", () => {
    const players = bulkCreateFakePlayers(4, [
      { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      { attributes: [] },
      { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      { attributes: [createFakeEatenByWerewolvesPlayerAttribute()] },
    ]);
    const game = createFakeGame({ players });

    it("should return players when they have the attribute.", () => {
      expect(getPlayersWithActiveAttributeName(game, PlayerAttributeNames.CHARMED)).toStrictEqual([players[0], players[2]]);
    });

    it("should return empty array when none has the attribute.", () => {
      expect(getPlayersWithActiveAttributeName(game, PlayerAttributeNames.SEEN)).toStrictEqual([]);
    });
  });

  describe("getAlivePlayers", () => {
    it("should get all alive players when called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(getAlivePlayers(game)).toStrictEqual([players[0], players[1], players[3]]);
    });
  });

  describe("getAliveVillagerSidedPlayers", () => {
    it("should get all alive villager sided players when called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(getAliveVillagerSidedPlayers(game)).toStrictEqual([players[1]]);
    });
  });

  describe("getAliveWerewolfSidedPlayers", () => {
    it("should get all alive werewolf sided players when called.", () => {
      const players = bulkCreateFakePlayers(4, [
        createFakeWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
      ]);
      const game = createFakeGame({ players });
      
      expect(getAliveWerewolfSidedPlayers(game)).toStrictEqual([players[0]]);
    });
  });

  describe("getLeftToCharmByPiedPiperPlayers", () => {
    it("should get left to charm by pied piper players when called.", () => {
      const players = bulkCreateFakePlayers(5, [
        createFakeWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePiedPiperAlivePlayer(),
        createFakeVillagerAlivePlayer(),
        createFakeVillagerAlivePlayer({ isAlive: false, attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });
      
      expect(getLeftToCharmByPiedPiperPlayers(game)).toStrictEqual<Player[]>([players[2], players[4]]);
    });
  });

  describe("getLeftToEatByWerewolvesPlayers", () => {
    it("should return left to eat by werewolves players when called.", () => {
      const players = bulkCreateFakePlayers(5, [
        createFakeWerewolfAlivePlayer(),
        createFakePiedPiperAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
        createFakeVillagerAlivePlayer({ isAlive: false }),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });

      expect(getLeftToEatByWerewolvesPlayers(game)).toStrictEqual<Player[]>([players[1]]);
    });
  });

  describe("getLeftToEatByWhiteWerewolfPlayers", () => {
    it("should return left to eat by white werewolf players when called.", () => {
      const players = bulkCreateFakePlayers(5, [
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
        createFakeVillagerAlivePlayer(),
        createFakeWerewolfAlivePlayer(),
      ]);
      const game = createFakeGame({ players });

      expect(getLeftToEatByWhiteWerewolfPlayers(game)).toStrictEqual<Player[]>([players[4]]);
    });
  });

  describe("getGroupOfPlayers", () => {
    const players = bulkCreateFakePlayers(6, [
      createFakeVillagerAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
      createFakeWerewolfAlivePlayer(),
      createFakeSeerAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
      createFakeWhiteWerewolfAlivePlayer({ attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
      createFakeVillagerAlivePlayer({ attributes: [createFakeEatenByWerewolvesPlayerAttribute()] }),
      createFakeWerewolfAlivePlayer({ attributes: [createFakeInLoveByCupidPlayerAttribute()] }),
    ]);
    const game = createFakeGame({ players });

    it("should return all players when group is all.", () => {
      expect(getGroupOfPlayers(game, PlayerGroups.SURVIVORS)).toStrictEqual(players);
    });

    it("should return players in love when group is lovers.", () => {
      expect(getGroupOfPlayers(game, PlayerGroups.LOVERS)).toStrictEqual([players[2], players[5]]);
    });

    it("should return charmed players when group is charmed.", () => {
      expect(getGroupOfPlayers(game, PlayerGroups.CHARMED)).toStrictEqual([players[0], players[3]]);
    });

    it("should return villagers when group is villagers.", () => {
      expect(getGroupOfPlayers(game, PlayerGroups.VILLAGERS)).toStrictEqual([players[0], players[2], players[4]]);
    });

    it("should return werewolves when group is werewolves.", () => {
      expect(getGroupOfPlayers(game, PlayerGroups.WEREWOLVES)).toStrictEqual([players[1], players[3], players[5]]);
    });
  });

  describe("isGameSourceRole", () => {
    it("should return true when source is role.", () => {
      expect(isGameSourceRole(RoleNames.WITCH)).toBe(true);
    });

    it("should return false when source is group.", () => {
      expect(isGameSourceRole(PlayerGroups.SURVIVORS)).toBe(false);
    });
  });

  describe("isGameSourceGroup", () => {
    it("should return true when source is group.", () => {
      expect(isGameSourceGroup(PlayerGroups.WEREWOLVES)).toBe(true);
    });

    it("should return false when source is role.", () => {
      expect(isGameSourceGroup(RoleNames.SEER)).toBe(false);
    });
  });

  describe("getNonexistentPlayerId", () => {
    it("should return undefined when all candidate ids are found.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      
      expect(getNonexistentPlayerId(game, players.map(player => player._id))).toBeUndefined();
    });

    it("should return unknown id when one candidate id is not found.", () => {
      const players = bulkCreateFakePlayers(6);
      const unknownId = createFakeObjectId();
      const game = createFakeGame({ players });
      
      expect(getNonexistentPlayerId(game, [...players.map(player => player._id), unknownId])).toStrictEqual(unknownId);
    });
  });

  describe("getNonexistentPlayer", () => {
    it("should return undefined when all candidate ids are found.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      
      expect(getNonexistentPlayer(game, players)).toBeUndefined();
    });

    it("should return unknown id when one candidate id is not found.", () => {
      const players = bulkCreateFakePlayers(6);
      const otherPlayer = createFakePlayer();
      const game = createFakeGame({ players });
      
      expect(getNonexistentPlayer(game, [...players, otherPlayer])).toStrictEqual(otherPlayer);
    });
  });

  describe("getFoxSniffedPlayers", () => {
    it("should get 3 targets with left and right neighbors when called.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 0 }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({ players });
      const expectedPlayers = [
        createFakePlayer(players[2]),
        createFakePlayer(players[3]),
        createFakePlayer(players[0]),
      ];

      expect(getFoxSniffedPlayers(players[3]._id, game)).toStrictEqual<Player[]>(expectedPlayers);
    });

    it("should get 3 targets with left neighbor when right is dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({ players });
      const expectedPlayers = [
        createFakePlayer(players[2]),
        createFakePlayer(players[3]),
        createFakePlayer(players[1]),
      ];

      expect(getFoxSniffedPlayers(players[3]._id, game)).toStrictEqual<Player[]>(expectedPlayers);
    });

    it("should get 2 targets with left neighbor when all rights are dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 1, isAlive: false }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({ players });
      const expectedPlayers = [
        createFakePlayer(players[2]),
        createFakePlayer(players[3]),
      ];

      expect(getFoxSniffedPlayers(players[3]._id, game)).toStrictEqual<Player[]>(expectedPlayers);
    });
    
    it("should get only 1 target when all neighbors.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 1, isAlive: false }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3, isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const expectedPlayers = [createFakePlayer(players[2])];

      expect(getFoxSniffedPlayers(players[2]._id, game)).toStrictEqual<Player[]>(expectedPlayers);
    });

    it("should throw error when player is not found in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 0 }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
      ];
      const game = createFakeGame({ players });
      const unknownPlayerId = createFakeObjectId();
      const exceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: unknownPlayerId.toString() };
      const exception = new UnexpectedException("getFoxSniffedTargets", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);

      expect(() => getFoxSniffedPlayers(unknownPlayerId, game)).toThrow(exception);
    });
  });

  describe("getNearestAliveNeighbor", () => {
    it("should throw error when player is not found in game.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 0 }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
        createFakeWerewolfAlivePlayer({ position: 4 }),
        createFakeVillagerAlivePlayer({ position: 5 }),
      ];
      const game = createFakeGame({ players });
      const options: GetNearestPlayerOptions = { direction: "right" };
      const unknownPlayerId = createFakeObjectId();
      const exceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: unknownPlayerId.toString() };
      const exception = new UnexpectedException("getNearestAliveNeighbor", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);
      
      expect(() => getNearestAliveNeighbor(unknownPlayerId, game, options)).toThrow(exception);
    });

    it("should get the nearest right alive player when called with right direction.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 3 }),
        createFakeVillagerAlivePlayer({ position: 5, isAlive: false }),
        createFakeWerewolfAlivePlayer({ position: 4 }),
      ];
      const game = createFakeGame({ players });
      const options: GetNearestPlayerOptions = { direction: "right" };
      
      expect(getNearestAliveNeighbor(players[5]._id, game, options)).toStrictEqual<Player>(players[1]);
    });

    it("should get the nearest left alive player when called with left direction.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 3 }),
        createFakeVillagerAlivePlayer({ position: 5, isAlive: false }),
        createFakeWerewolfAlivePlayer({ position: 4 }),
        createFakeVillagerAlivePlayer({ position: 1 }),
      ];
      const game = createFakeGame({ players });
      const options: GetNearestPlayerOptions = { direction: "left" };
      
      expect(getNearestAliveNeighbor(players[5]._id, game, options)).toStrictEqual<Player>(players[4]);
    });

    it("should get the nearest left alive villager player when called with left direction and villager side.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ position: 5, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 3 }),
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 4 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
      ];
      const game = createFakeGame({ players });
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: RoleSides.VILLAGERS };
      
      expect(getNearestAliveNeighbor(players[3]._id, game, options)).toStrictEqual<Player>(players[1]);
    });

    it("should get the nearest left alive werewolf player when called with left direction and werewolf side.", () => {
      const players = [
        createFakeWerewolfAlivePlayer({ position: 0 }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 2 }),
        createFakeVillagerAlivePlayer({ position: 3 }),
        createFakeWerewolfAlivePlayer({ position: 4 }),
        createFakeVillagerAlivePlayer({ position: 5, isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: RoleSides.WEREWOLVES };
      
      expect(getNearestAliveNeighbor(players[1]._id, game, options)).toStrictEqual<Player>(players[0]);
    });

    it("should return undefined when can't find player with conditions.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ position: 5, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 3 }),
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 1 }),
        createFakeWerewolfAlivePlayer({ position: 4 }),
        createFakeWerewolfAlivePlayer({ position: 2, isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: RoleSides.WEREWOLVES };
      
      expect(getNearestAliveNeighbor(players[4]._id, game, options)).toBeUndefined();
    });

    it("should return undefined when there are no alive players.", () => {
      const players = [
        createFakeVillagerAlivePlayer({ position: 5, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 3, isAlive: false }),
        createFakeWerewolfAlivePlayer({ position: 0, isAlive: false }),
        createFakeVillagerAlivePlayer({ position: 1, isAlive: false }),
        createFakeWerewolfAlivePlayer({ position: 4, isAlive: false }),
        createFakeWerewolfAlivePlayer({ position: 2, isAlive: false }),
      ];
      const game = createFakeGame({ players });
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: RoleSides.WEREWOLVES };
      
      expect(getNearestAliveNeighbor(players[4]._id, game, options)).toBeUndefined();
    });
  });

  describe("getExpectedPlayersToPlay", () => {
    it("should throw error when there is no current play.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players });
      const interpolations = { gameId: game._id };
    
      expect(() => getExpectedPlayersToPlay(game)).toThrow(undefined);
      expect(mocks.unexpectedExceptionFactory.createNoCurrentGamePlayUnexpectedException).toHaveBeenCalledExactlyOnceWith("getExpectedPlayersToPlay", interpolations);
    });

    it("should return alive werewolves when source is group of werewolves.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayWerewolvesEat() });

      expect(getExpectedPlayersToPlay(game)).toStrictEqual<Player[]>([
        players[0],
        players[2],
      ]);
    });
    
    it("should return alive two sisters when source is specific role.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()] }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayTwoSistersMeetEachOther() });

      expect(getExpectedPlayersToPlay(game)).toStrictEqual<Player[]>([players[3]]);
    });

    it("should not return sheriff when source is sheriff but action is not DELEGATE and sheriff is dead.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlaySheriffSettlesVotes() });

      expect(getExpectedPlayersToPlay(game)).toStrictEqual<Player[]>([]);
    });

    it("should return sheriff when source is sheriff and action is DELEGATE even if he is dying.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeVillagerAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlaySheriffDelegates() });

      expect(getExpectedPlayersToPlay(game)).toStrictEqual<Player[]>([players[5]]);
    });

    it("should return hunter when source is hunter and action is SHOOT even if he is dying.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeHunterAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayHunterShoots() });

      expect(getExpectedPlayersToPlay(game)).toStrictEqual<Player[]>([players[5]]);
    });

    it("should return scapegoat when source is scapegoat and action is BAN_VOTING even if he is dying.", () => {
      const players = [
        createFakeWerewolfAlivePlayer(),
        createFakeWerewolfAlivePlayer({ isAlive: false }),
        createFakeWhiteWerewolfAlivePlayer(),
        createFakeTwoSistersAlivePlayer(),
        createFakeTwoSistersAlivePlayer({ isAlive: false }),
        createFakeScapegoatAlivePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute()], isAlive: false }),
      ];
      const game = createFakeGame({ players, currentPlay: createFakeGamePlayScapegoatBansVoting() });

      expect(getExpectedPlayersToPlay(game)).toStrictEqual<Player[]>([players[5]]);
    });
  });
});