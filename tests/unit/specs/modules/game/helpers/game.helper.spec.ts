import { cloneDeep } from "lodash";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import { areAllPlayersDead, areAllVillagersAlive, areAllWerewolvesAlive, getAdditionalCardWithId, getAlivePlayers, getAliveVillagerSidedPlayers, getAliveWerewolfSidedPlayers, getFoxSniffedPlayers, getGroupOfPlayers, getLeftToCharmByPiedPiperPlayers, getNearestAliveNeighbor, getNonexistentPlayer, getNonexistentPlayerId, getPlayerDtoWithRole, getPlayersWithAttribute, getPlayersWithCurrentRole, getPlayersWithCurrentSide, getPlayerWithAttribute, getPlayerWithCurrentRole, getPlayerWithId, getPlayerWithIdOrThrow, isGameSourceGroup, isGameSourceRole } from "../../../../../../src/modules/game/helpers/game.helper";
import type { Player } from "../../../../../../src/modules/game/schemas/player/player.schema";
import type { GetNearestPlayerOptions } from "../../../../../../src/modules/game/types/game.type";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../src/modules/role/enums/role.enum";
import { UNEXPECTED_EXCEPTION_REASONS } from "../../../../../../src/shared/exception/enums/unexpected-exception.enum";
import type { ExceptionInterpolations } from "../../../../../../src/shared/exception/types/exception.type";
import { UnexpectedException } from "../../../../../../src/shared/exception/types/unexpected-exception.type";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { bulkCreateFakeGameAdditionalCards } from "../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGame } from "../../../../../factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeEatenByWerewolvesPlayerAttribute, createFakeInLoveByCupidPlayerAttribute } from "../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePiedPiperAlivePlayer, createFakeSeerAlivePlayer, createFakeVillagerAlivePlayer, createFakeWerewolfAlivePlayer, createFakeWhiteWerewolfAlivePlayer } from "../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "../../../../../factories/shared/mongoose/mongoose.factory";

describe("Game Helper", () => {
  describe("getPlayerDtoWithRole", () => {
    const players = bulkCreateFakeCreateGamePlayerDto(6, [
      { role: { name: ROLE_NAMES.WITCH } },
      { role: { name: ROLE_NAMES.SEER } },
      { role: { name: ROLE_NAMES.WEREWOLF } },
      { role: { name: ROLE_NAMES.TWO_SISTERS } },
      { role: { name: ROLE_NAMES.TWO_SISTERS } },
      { role: { name: ROLE_NAMES.IDIOT } },
    ]);

    it("should return player with role when a player has this role.", () => {
      expect(getPlayerDtoWithRole(players, ROLE_NAMES.WEREWOLF)).toStrictEqual(players[2]);
    });

    it("should return undefined when player with role is not found.", () => {
      expect(getPlayerDtoWithRole(players, ROLE_NAMES.THREE_BROTHERS)).toBeUndefined();
    });
  });

  describe("getPlayerWithCurrentRole", () => {
    const players = bulkCreateFakePlayers(6, [
      { role: { current: ROLE_NAMES.WITCH, original: ROLE_NAMES.WITCH, isRevealed: false } },
      { role: { current: ROLE_NAMES.SEER, original: ROLE_NAMES.SEER, isRevealed: false } },
      { role: { current: ROLE_NAMES.WEREWOLF, original: ROLE_NAMES.WEREWOLF, isRevealed: false } },
      { role: { current: ROLE_NAMES.TWO_SISTERS, original: ROLE_NAMES.TWO_SISTERS, isRevealed: false } },
      { role: { current: ROLE_NAMES.TWO_SISTERS, original: ROLE_NAMES.TWO_SISTERS, isRevealed: false } },
      { role: { current: ROLE_NAMES.IDIOT, original: ROLE_NAMES.IDIOT, isRevealed: false } },
    ]);

    it("should return player with role when a player has this role.", () => {
      expect(getPlayerWithCurrentRole(players, ROLE_NAMES.SEER)).toStrictEqual(players[1]);
    });

    it("should return undefined when player with role is not found.", () => {
      expect(getPlayerWithCurrentRole(players, ROLE_NAMES.BIG_BAD_WOLF)).toBeUndefined();
    });
  });

  describe("getPlayersWithCurrentRole", () => {
    const players = bulkCreateFakePlayers(6, [
      { role: { current: ROLE_NAMES.THREE_BROTHERS, original: ROLE_NAMES.WITCH, isRevealed: false } },
      { role: { current: ROLE_NAMES.THREE_BROTHERS, original: ROLE_NAMES.SEER, isRevealed: false } },
      { role: { current: ROLE_NAMES.THREE_BROTHERS, original: ROLE_NAMES.WEREWOLF, isRevealed: false } },
      { role: { current: ROLE_NAMES.TWO_SISTERS, original: ROLE_NAMES.TWO_SISTERS, isRevealed: false } },
      { role: { current: ROLE_NAMES.TWO_SISTERS, original: ROLE_NAMES.TWO_SISTERS, isRevealed: false } },
      { role: { current: ROLE_NAMES.IDIOT, original: ROLE_NAMES.IDIOT, isRevealed: false } },
    ]);

    it("should return players when they have this role.", () => {
      expect(getPlayersWithCurrentRole(players, ROLE_NAMES.THREE_BROTHERS)).toStrictEqual([players[0], players[1], players[2]]);
    });

    it("should return empty array when no one has the role.", () => {
      expect(getPlayersWithCurrentRole(players, ROLE_NAMES.WEREWOLF)).toStrictEqual([]);
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

    it("should return werewolves when they have this side.", () => {
      expect(getPlayersWithCurrentSide(players, ROLE_SIDES.WEREWOLVES)).toStrictEqual([players[0], players[1], players[4], players[5]]);
    });

    it("should return villagers when they have this side.", () => {
      expect(getPlayersWithCurrentSide(players, ROLE_SIDES.VILLAGERS)).toStrictEqual([players[2], players[3]]);
    });
  });

  describe("getPlayerWithId", () => {
    it("should get player with specific id when called with this id.", () => {
      const players = bulkCreateFakePlayers(6);
      
      expect(getPlayerWithId(players, players[2]._id)).toStrictEqual(players[2]);
    });
    
    it("should return undefined when called with unknown id.", () => {
      const players = bulkCreateFakePlayers(6);
      
      expect(getPlayerWithId(players, createFakeObjectId())).toBeUndefined();
    });
  });

  describe("getPlayerWithIdOrThrow", () => {
    it("should get player with specific id when called with this id.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      const exceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: players[2]._id.toString() };
      const exception = new UnexpectedException("killPlayer", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);
      
      expect(getPlayerWithIdOrThrow(players[2]._id, game, exception)).toStrictEqual(players[2]);
    });

    it("should throw error when called with unknown id.", () => {
      const players = bulkCreateFakePlayers(6);
      const game = createFakeGame({ players });
      const unknownPlayerId = createFakeObjectId();
      const exceptionInterpolations: ExceptionInterpolations = { gameId: game._id.toString(), playerId: unknownPlayerId.toString() };
      const exception = new UnexpectedException("killPlayer", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);
      
      expect(() => getPlayerWithIdOrThrow(unknownPlayerId, game, exception)).toThrow(exception);
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

    it("should return false when empty array is provided.", () => {
      expect(areAllWerewolvesAlive([])).toBe(false);
    });

    it("should return true when all werewolves are alive.", () => {
      expect(areAllWerewolvesAlive(players)).toBe(true);
    });

    it("should return true when at least one werewolf is dead.", () => {
      const notAllAlivePlayers = cloneDeep(players);
      notAllAlivePlayers[0].isAlive = false;
      
      expect(areAllWerewolvesAlive(notAllAlivePlayers)).toBe(false);
    });
  });

  describe("areAllVillagersAlive", () => {
    const players = bulkCreateFakePlayers(4, [
      createFakeWerewolfAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeVillagerAlivePlayer(),
      createFakeWerewolfAlivePlayer(),
    ]);

    it("should return false when empty array is provided.", () => {
      expect(areAllVillagersAlive([])).toBe(false);
    });

    it("should return true when all villagers are alive.", () => {
      expect(areAllVillagersAlive(players)).toBe(true);
    });

    it("should return true when at least one villager is dead.", () => {
      const notAllAlivePlayers = cloneDeep(players);
      notAllAlivePlayers[1].isAlive = false;
      
      expect(areAllVillagersAlive(notAllAlivePlayers)).toBe(false);
    });
  });

  describe("areAllPlayersDead", () => {
    const players = bulkCreateFakePlayers(4, [
      createFakePlayer({ isAlive: false }),
      createFakePlayer({ isAlive: false }),
      createFakePlayer({ isAlive: true }),
      createFakePlayer({ isAlive: false }),
    ]);

    it("should return false when empty array is provided.", () => {
      expect(areAllPlayersDead([])).toBe(false);
    });

    it("should return false when at least one player is alive.", () => {
      expect(areAllPlayersDead(players)).toBe(false);
    });

    it("should return true when all players are dead.", () => {
      players[2].isAlive = false;
      
      expect(areAllPlayersDead(players)).toBe(true);
    });
  });

  describe("getPlayerWithAttribute", () => {
    it("should return first player with attribute when called.", () => {
      const players = bulkCreateFakePlayers(4, [
        { attributes: [] },
        { attributes: [createFakeEatenByWerewolvesPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      ]);

      expect(getPlayerWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.CHARMED)).toStrictEqual<Player>(players[2]);
    });

    it("should return undefined when player with attribute is not found.", () => {
      const players = bulkCreateFakePlayers(4, [
        { attributes: [] },
        { attributes: [createFakeEatenByWerewolvesPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
        { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      ]);

      expect(getPlayerWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.SEEN)).toBeUndefined();
    });
  });

  describe("getPlayersWithAttribute", () => {
    const players = bulkCreateFakePlayers(4, [
      { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      { attributes: [] },
      { attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] },
      { attributes: [createFakeEatenByWerewolvesPlayerAttribute()] },
    ]);

    it("should return players when they have the attribute.", () => {
      expect(getPlayersWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.CHARMED)).toStrictEqual([players[0], players[2]]);
    });

    it("should return empty array when none has the attribute.", () => {
      expect(getPlayersWithAttribute(players, PLAYER_ATTRIBUTE_NAMES.SEEN)).toStrictEqual([]);
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
      
      expect(getAlivePlayers(players)).toStrictEqual([players[0], players[1], players[3]]);
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
      
      expect(getAliveVillagerSidedPlayers(players)).toStrictEqual([players[1]]);
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
      
      expect(getAliveWerewolfSidedPlayers(players)).toStrictEqual([players[0]]);
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
      
      expect(getLeftToCharmByPiedPiperPlayers(players)).toStrictEqual([players[2], players[4]]);
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

    it("should return all players when group is all.", () => {
      expect(getGroupOfPlayers(players, PLAYER_GROUPS.ALL)).toStrictEqual(players);
    });

    it("should return players in love when group is lovers.", () => {
      expect(getGroupOfPlayers(players, PLAYER_GROUPS.LOVERS)).toStrictEqual([players[2], players[5]]);
    });

    it("should return charmed players when group is charmed.", () => {
      expect(getGroupOfPlayers(players, PLAYER_GROUPS.CHARMED)).toStrictEqual([players[0], players[3]]);
    });

    it("should return villagers when group is villagers.", () => {
      expect(getGroupOfPlayers(players, PLAYER_GROUPS.VILLAGERS)).toStrictEqual([players[0], players[2], players[4]]);
    });

    it("should return werewolves when group is werewolves.", () => {
      expect(getGroupOfPlayers(players, PLAYER_GROUPS.WEREWOLVES)).toStrictEqual([players[1], players[3], players[5]]);
    });
  });

  describe("isGameSourceRole", () => {
    it("should return true when source is role.", () => {
      expect(isGameSourceRole(ROLE_NAMES.WITCH)).toBe(true);
    });

    it("should return false when source is group.", () => {
      expect(isGameSourceRole(PLAYER_GROUPS.ALL)).toBe(false);
    });
  });

  describe("isGameSourceGroup", () => {
    it("should return true when source is group.", () => {
      expect(isGameSourceGroup(PLAYER_GROUPS.WEREWOLVES)).toBe(true);
    });

    it("should return false when source is role.", () => {
      expect(isGameSourceGroup(ROLE_NAMES.SEER)).toBe(false);
    });
  });

  describe("getNonexistentPlayerId", () => {
    it("should return undefined when all candidate ids are found.", () => {
      const players = bulkCreateFakePlayers(6);
      
      expect(getNonexistentPlayerId(players, players.map(player => player._id))).toBeUndefined();
    });

    it("should return unknown id when one candidate id is not found.", () => {
      const players = bulkCreateFakePlayers(6);
      const unknownId = createFakeObjectId();
      
      expect(getNonexistentPlayerId(players, [...players.map(player => player._id), unknownId])).toStrictEqual(unknownId);
    });
  });

  describe("getNonexistentPlayer", () => {
    it("should return undefined when all candidate ids are found.", () => {
      const players = bulkCreateFakePlayers(6);
      
      expect(getNonexistentPlayer(players, players)).toBeUndefined();
    });

    it("should return unknown id when one candidate id is not found.", () => {
      const players = bulkCreateFakePlayers(6);
      const otherPlayer = createFakePlayer();
      
      expect(getNonexistentPlayer(players, [...players, otherPlayer])).toStrictEqual(otherPlayer);
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
      const exception = new UnexpectedException("getFoxSniffedTargets", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);

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
      const exception = new UnexpectedException("getNearestAliveNeighbor", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, exceptionInterpolations);
      
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
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: ROLE_SIDES.VILLAGERS };
      
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
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: ROLE_SIDES.WEREWOLVES };
      
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
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: ROLE_SIDES.WEREWOLVES };
      
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
      const options: GetNearestPlayerOptions = { direction: "left", playerSide: ROLE_SIDES.WEREWOLVES };
      
      expect(getNearestAliveNeighbor(players[4]._id, game, options)).toBeUndefined();
    });
  });
});