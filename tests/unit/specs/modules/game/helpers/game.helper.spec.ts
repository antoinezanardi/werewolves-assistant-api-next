import { faker } from "@faker-js/faker";
import { cloneDeep } from "lodash";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../../src/modules/game/enums/player.enum";
import { areAllVillagersAlive, areAllWerewolvesAlive, getAdditionalCardWithId, getAlivePlayers, getGroupOfPlayers, getLeftToCharmByPiedPiperPlayers, getNonexistentPlayer, getNonexistentPlayerId, getPlayerDtoWithRole, getPlayersWithAttribute, getPlayersWithCurrentRole, getPlayersWithCurrentSide, getPlayerWithCurrentRole, getPlayerWithId, getUpcomingGamePlay, getUpcomingGamePlayAction, getUpcomingGamePlaySource, isGameSourceGroup, isGameSourceRole } from "../../../../../../src/modules/game/helpers/game.helper";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../src/modules/role/enums/role.enum";
import { bulkCreateFakeCreateGamePlayerDto } from "../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";
import { bulkCreateFakeGameAdditionalCards } from "../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { bulkCreateFakeGamePlays } from "../../../../../factories/game/schemas/game-play/game-play.schema.factory";
import { createFakePlayerCharmedAttribute, createFakePlayerEatenByWerewolvesAttribute, createFakePlayerInLoveAttribute } from "../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePiedPiperPlayer, createFakeSeerPlayer, createFakeVillagerPlayer, createFakeWerewolfPlayer, createFakeWhiteWerewolfPlayer } from "../../../../../factories/game/schemas/player/player-with-role.schema.factory";
import { bulkCreateFakePlayers, createFakePlayer } from "../../../../../factories/game/schemas/player/player.schema.factory";
import { createObjectIdFromString } from "../../../../../helpers/mongoose/mongoose.helper";

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
      createFakeWerewolfPlayer(),
      createFakeWerewolfPlayer(),
      createFakeVillagerPlayer(),
      createFakeVillagerPlayer(),
      createFakeWerewolfPlayer(),
      createFakeWerewolfPlayer(),
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
      expect(getPlayerWithId(players, createObjectIdFromString(faker.database.mongodbObjectId()))).toBeUndefined();
    });
  });

  describe("getAdditionalCardWithId", () => {
    it("should get card with specific id when called with this id.", () => {
      const cards = bulkCreateFakeGameAdditionalCards(6);
      expect(getAdditionalCardWithId(cards, cards[3]._id)).toStrictEqual(cards[3]);
    });

    it("should return undefined when cards are undefined.", () => {
      expect(getAdditionalCardWithId(undefined, createObjectIdFromString(faker.database.mongodbObjectId()))).toBeUndefined();
    });

    it("should return undefined when called with unknown id.", () => {
      const cards = bulkCreateFakeGameAdditionalCards(6);
      expect(getAdditionalCardWithId(cards, createObjectIdFromString(faker.database.mongodbObjectId()))).toBeUndefined();
    });
  });

  describe("areAllWerewolvesAlive", () => {
    const players = bulkCreateFakePlayers(6, [
      createFakeWerewolfPlayer(),
      createFakeWerewolfPlayer(),
      createFakeVillagerPlayer(),
      createFakeVillagerPlayer(),
      createFakeWerewolfPlayer(),
      createFakeWerewolfPlayer(),
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
      createFakeWerewolfPlayer(),
      createFakeVillagerPlayer(),
      createFakeVillagerPlayer(),
      createFakeWerewolfPlayer(),
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

  describe("getPlayersWithAttribute", () => {
    const players = bulkCreateFakePlayers(4, [
      { attributes: [createFakePlayerCharmedAttribute()] },
      { attributes: [] },
      { attributes: [createFakePlayerCharmedAttribute()] },
      { attributes: [createFakePlayerEatenByWerewolvesAttribute()] },
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
        createFakeWerewolfPlayer(),
        createFakeVillagerPlayer(),
        createFakeVillagerPlayer({ isAlive: false }),
        createFakeWerewolfPlayer(),
      ]);
      expect(getAlivePlayers(players)).toStrictEqual([players[0], players[1], players[3]]);
    });
  });

  describe("getLeftToCharmByPiedPiperPlayers", () => {
    it("should get left to charm by pied piper players when called.", () => {
      const players = bulkCreateFakePlayers(5, [
        createFakeWerewolfPlayer({ attributes: [createFakePlayerCharmedAttribute()] }),
        createFakePiedPiperPlayer(),
        createFakeVillagerPlayer(),
        createFakeVillagerPlayer({ isAlive: false, attributes: [createFakePlayerCharmedAttribute()] }),
        createFakeWerewolfPlayer(),
      ]);
      expect(getLeftToCharmByPiedPiperPlayers(players)).toStrictEqual([players[2], players[4]]);
    });
  });

  describe("getGroupOfPlayers", () => {
    const players = bulkCreateFakePlayers(6, [
      createFakeVillagerPlayer({ attributes: [createFakePlayerCharmedAttribute()] }),
      createFakeWerewolfPlayer(),
      createFakeSeerPlayer({ attributes: [createFakePlayerInLoveAttribute()] }),
      createFakeWhiteWerewolfPlayer({ attributes: [createFakePlayerCharmedAttribute()] }),
      createFakeVillagerPlayer({ attributes: [createFakePlayerEatenByWerewolvesAttribute()] }),
      createFakeWerewolfPlayer({ attributes: [createFakePlayerInLoveAttribute()] }),
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
      const unknownId = createObjectIdFromString(faker.database.mongodbObjectId());
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

  describe("getUpcomingGamePlay", () => {
    it("should return undefined when upcoming game plays are empty.", () => {
      expect(getUpcomingGamePlay([])).toBeUndefined();
    });

    it("should return upcoming game play when called.", () => {
      const upcomingGamePlays = bulkCreateFakeGamePlays(4);
      expect(getUpcomingGamePlay(upcomingGamePlays)).toStrictEqual(upcomingGamePlays[0]);
    });
  });

  describe("getUpcomingGamePlayAction", () => {
    it("should return undefined when upcoming game plays are empty.", () => {
      expect(getUpcomingGamePlayAction([])).toBeUndefined();
    });

    it("should return upcoming game play action when called.", () => {
      const upcomingGamePlays = bulkCreateFakeGamePlays(4);
      expect(getUpcomingGamePlayAction(upcomingGamePlays)).toStrictEqual(upcomingGamePlays[0].action);
    });
  });

  describe("getUpcomingGamePlaySource", () => {
    it("should return undefined when upcoming game plays are empty.", () => {
      expect(getUpcomingGamePlaySource([])).toBeUndefined();
    });

    it("should return upcoming game play action when called.", () => {
      const upcomingGamePlays = bulkCreateFakeGamePlays(4);
      expect(getUpcomingGamePlaySource(upcomingGamePlays)).toStrictEqual(upcomingGamePlays[0].source);
    });
  });
});