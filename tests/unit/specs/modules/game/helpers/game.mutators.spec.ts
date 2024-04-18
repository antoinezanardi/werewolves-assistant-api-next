import { addPlayerAttributeInGame, addPlayersAttributeInGame, appendUpcomingPlayInGame, prependUpcomingPlayInGame, removePlayerAttributeByNameAndSourceInGame, removePlayerAttributeByNameInGame, updateAdditionalCardInGame, updatePlayerInGame } from "@/modules/game/helpers/game.mutators";
import type { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import type { Game } from "@/modules/game/schemas/game.schema";

import { createFakeGameAdditionalCard } from "@tests/factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGamePlayCupidCharms, createFakeGamePlayHunterShoots } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGame } from "@tests/factories/game/schemas/game.schema.factory";
import { createFakeCharmedByPiedPiperPlayerAttribute, createFakeSheriffBySheriffPlayerAttribute, createFakeSheriffBySurvivorsPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakeSeerAlivePlayer } from "@tests/factories/game/schemas/player/player-with-role.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game Mutator", () => {
  describe("updatePlayerInGame", () => {
    it("should return game as is when player id is not found among players.", () => {
      const unknownPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const updatedPlayer = createFakeSeerAlivePlayer();
      const game = createFakeGame({ players });

      expect(updatePlayerInGame(unknownPlayerId, updatedPlayer, game)).toStrictEqual<Game>(game);
    });

    it("should return game with updated player when player id found.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const newName = "It's a me, Mario !";
      const updatedPlayer = createFakeSeerAlivePlayer({ ...players[2], name: newName });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(game.players[0]),
          createFakePlayer(game.players[1]),
          createFakePlayer({
            ...game.players[2],
            name: newName,
          }),
          createFakePlayer(game.players[3]),
        ],
      });

      expect(updatePlayerInGame(updatedPlayer._id, updatedPlayer, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should not mutate original game when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const newName = "It's a me, Mario !";
      const updatedPlayer = createFakeSeerAlivePlayer({ ...players[2], name: newName });
      const clonedGame = createFakeGame(game);
      updatePlayerInGame(updatedPlayer._id, updatedPlayer, game);

      expect(game).toStrictEqual<Game>(clonedGame);
    });
  });

  describe("addPlayerAttributeInGame", () => {
    it("should return game as is when player id is not found among players.", () => {
      const attributeToAdd = createFakeCharmedByPiedPiperPlayerAttribute();
      const unknownPlayerId = createFakeObjectId();
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(addPlayerAttributeInGame(unknownPlayerId, game, attributeToAdd)).toStrictEqual<Game>(game);
    });

    it("should return game with player with new attribute when player is found.", () => {
      const attributeToAdd = createFakeCharmedByPiedPiperPlayerAttribute();
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(game.players[0]),
          createFakePlayer(game.players[1]),
          createFakePlayer({
            ...game.players[2],
            attributes: [attributeToAdd],
          }),
          createFakePlayer(game.players[3]),
        ],
      });

      expect(addPlayerAttributeInGame(players[2]._id, game, attributeToAdd)).toStrictEqual<Game>(expectedGame);
    });

    it("should not mutate the original game when called.", () => {
      const attributeToAdd = createFakeCharmedByPiedPiperPlayerAttribute();
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const clonedGame = createFakeGame(game);
      addPlayerAttributeInGame(players[2]._id, game, attributeToAdd);

      expect(game).toStrictEqual<Game>(clonedGame);
    });
  });

  describe("addPlayersAttributeInGame", () => {
    it("should return game as is when player ids are not in the game.", () => {
      const attributeToAdd = createFakeCharmedByPiedPiperPlayerAttribute();
      const unknownPlayerIds = [
        createFakeObjectId(),
        createFakeObjectId(),
        createFakeObjectId(),
      ];
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });

      expect(addPlayersAttributeInGame(unknownPlayerIds, game, attributeToAdd)).toStrictEqual<Game>(game);
    });

    it("should return game with players with new attribute when players are found.", () => {
      const attributeToAdd = createFakeCharmedByPiedPiperPlayerAttribute();
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          createFakePlayer(game.players[0]),
          createFakePlayer({
            ...game.players[1],
            attributes: [attributeToAdd],
          }),
          createFakePlayer({
            ...game.players[2],
            attributes: [attributeToAdd],
          }),
          createFakePlayer(game.players[3]),
        ],
      });

      expect(addPlayersAttributeInGame([players[1]._id, players[2]._id], game, attributeToAdd)).toStrictEqual<Game>(expectedGame);
    });

    it("should not mutate the original game when called.", () => {
      const attributeToAdd = createFakeCharmedByPiedPiperPlayerAttribute();
      const players = [
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const clonedGame = createFakeGame(game);
      addPlayersAttributeInGame([players[1]._id, players[2]._id], game, attributeToAdd);

      expect(game).toStrictEqual<Game>(clonedGame);
    });
  });

  describe("removePlayerAttributeByNameInGame", () => {
    it("should return game as is when player is not found in game.", () => {
      const game = createFakeGame();

      expect(removePlayerAttributeByNameInGame(createFakeObjectId(), game, "sheriff")).toStrictEqual<Game>(game);
    });

    it("should return game with player without his sheriff attribute when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedGame = createFakeGame({
        ...game,
        players: [
          game.players[0],
          createFakePlayer({ ...players[1], attributes: [createFakeCharmedByPiedPiperPlayerAttribute()] }),
          game.players[2],
          game.players[3],
        ],
      });

      expect(removePlayerAttributeByNameInGame(game.players[1]._id, game, "sheriff")).toStrictEqual<Game>(expectedGame);
    });

    it("should not mutate the original game when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const clonedGame = createFakeGame(game);
      removePlayerAttributeByNameInGame(game.players[1]._id, game, "sheriff");

      expect(game).toStrictEqual<Game>(clonedGame);
    });
  });

  describe("removePlayerAttributeByNameAndSourceInGame", () => {
    it("should return game as is when player is not found in game.", () => {
      const game = createFakeGame();

      expect(removePlayerAttributeByNameAndSourceInGame(createFakeObjectId(), game, "sheriff", "survivors")).toStrictEqual<Game>(game);
    });

    it("should return game with player without his sheriff from sheriff attribute when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer({
          attributes: [
            createFakeSheriffBySurvivorsPlayerAttribute(),
            createFakeSheriffBySheriffPlayerAttribute(),
            createFakeCharmedByPiedPiperPlayerAttribute({ source: "sheriff" }),
          ],
        }),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const expectedAttributes = [
        createFakeSheriffBySurvivorsPlayerAttribute(),
        createFakeCharmedByPiedPiperPlayerAttribute({ source: "sheriff" }),
      ];
      const expectedGame = createFakeGame({
        ...game,
        players: [
          game.players[0],
          createFakePlayer({ ...players[1], attributes: expectedAttributes }),
          game.players[2],
          game.players[3],
        ],
      });

      expect(removePlayerAttributeByNameAndSourceInGame(game.players[1]._id, game, "sheriff", "sheriff")).toStrictEqual<Game>(expectedGame);
    });

    it("should not mutate the original game when called.", () => {
      const players = [
        createFakePlayer(),
        createFakePlayer({ attributes: [createFakeSheriffBySurvivorsPlayerAttribute(), createFakeCharmedByPiedPiperPlayerAttribute()] }),
        createFakePlayer(),
        createFakePlayer(),
      ];
      const game = createFakeGame({ players });
      const clonedGame = createFakeGame(game);
      removePlayerAttributeByNameAndSourceInGame(game.players[1]._id, game, "sheriff", "survivors");

      expect(game).toStrictEqual<Game>(clonedGame);
    });
  });

  describe("prependUpcomingPlayInGame", () => {
    it("should prepend play in upcoming plays when called.", () => {
      const gamePlayToPrepend = createFakeGamePlayHunterShoots();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayCupidCharms()] });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [gamePlayToPrepend, ...game.upcomingPlays],
      });

      expect(prependUpcomingPlayInGame(gamePlayToPrepend, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should not mutate the original game when called.", () => {
      const gamePlayToPrepend = createFakeGamePlayHunterShoots();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayCupidCharms()] });
      const clonedGame = createFakeGame(game);
      prependUpcomingPlayInGame(gamePlayToPrepend, game);

      expect(game).toStrictEqual<Game>(clonedGame);
    });
  });

  describe("appendUpcomingPlayInGame", () => {
    it("should append play in upcoming plays when called.", () => {
      const gamePlayToAppend = createFakeGamePlayHunterShoots();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayCupidCharms()] });
      const expectedGame = createFakeGame({
        ...game,
        upcomingPlays: [...game.upcomingPlays, gamePlayToAppend],
      });

      expect(appendUpcomingPlayInGame(gamePlayToAppend, game)).toStrictEqual<Game>(expectedGame);
    });

    it("should not mutate the original game when called.", () => {
      const gamePlayToAppend = createFakeGamePlayHunterShoots();
      const game = createFakeGame({ upcomingPlays: [createFakeGamePlayCupidCharms()] });
      const clonedGame = createFakeGame(game);
      appendUpcomingPlayInGame(gamePlayToAppend, game);

      expect(game).toStrictEqual<Game>(clonedGame);
    });
  });

  describe("updateAdditionalCardInGame", () => {
    it("should return game as is when game doesn't have any additional card.", () => {
      const cardId = createFakeObjectId();
      const cardDataToUpdate: Partial<GameAdditionalCard> = { isUsed: false };
      const game = createFakeGame();

      expect(updateAdditionalCardInGame(cardId, cardDataToUpdate, game)).toStrictEqual<Game>(game);
    });

    it("should return game as is when card id is not found in game.", () => {
      const cardId = createFakeObjectId();
      const cardDataToUpdate: Partial<GameAdditionalCard> = { isUsed: false };
      const game = createFakeGame({ additionalCards: [createFakeGameAdditionalCard()] });

      expect(updateAdditionalCardInGame(cardId, cardDataToUpdate, game)).toStrictEqual<Game>(game);
    });

    it("should return game with updated card when card id is found in game.", () => {
      const cardId = createFakeObjectId();
      const cardDataToUpdate: Partial<GameAdditionalCard> = { isUsed: false };
      const additionalCard = createFakeGameAdditionalCard({ _id: cardId });
      const game = createFakeGame({ additionalCards: [additionalCard] });
      const expectedGame = createFakeGame({
        ...game,
        additionalCards: [createFakeGameAdditionalCard({ ...additionalCard, ...cardDataToUpdate })],
      });

      expect(updateAdditionalCardInGame(cardId, cardDataToUpdate, game)).toStrictEqual<Game>(expectedGame);
    });
  });
});