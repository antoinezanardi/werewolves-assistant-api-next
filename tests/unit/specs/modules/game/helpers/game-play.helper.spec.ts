import { faker } from "@faker-js/faker";
import type { MakeGamePlayTargetWithRelationsDto } from "../../../../../../src/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import type { MakeGamePlayVoteWithRelationsDto } from "../../../../../../src/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";
import type { MakeGamePlayWithRelationsDto } from "../../../../../../src/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { WITCH_POTIONS } from "../../../../../../src/modules/game/enums/game-play.enum";
import { createMakeGamePlayDtoWithRelations, getChosenCardFromMakeGamePlayDto, getTargetsWithRelationsFromMakeGamePlayDto, getVotesWithRelationsFromMakeGamePlayDto } from "../../../../../../src/modules/game/helpers/game-play.helper";
import { ROLE_SIDES } from "../../../../../../src/modules/role/enums/role.enum";
import { createFakeMakeGamePlayDto } from "../../../../../factories/game/dto/make-game-play/make-game-play.dto.factory";
import { bulkCreateFakeGameAdditionalCards } from "../../../../../factories/game/schemas/game-additional-card/game-additional-card.schema.factory";
import { createFakeGame } from "../../../../../factories/game/schemas/game.schema.factory";

describe("Game Play Helper", () => {
  describe("getVotesWithRelationsFromMakeGamePlayDto", () => {
    it("should return undefined when votes are undefined.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      expect(getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toBeUndefined();
    });

    it("should throw error when votes contains one unknown source.", () => {
      const game = createFakeGame();
      const fakePlayerId = faker.database.mongodbObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: fakePlayerId, targetId: game.players[0]._id },
        ],
      });
      expect(() => getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(`Player with id "${fakePlayerId}" not found : Game Play - Player in \`votes.source\` is not in the game players`);
    });

    it("should throw error when votes contains one unknown target.", () => {
      const game = createFakeGame();
      const fakePlayerId = faker.database.mongodbObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: fakePlayerId },
        ],
      });
      expect(() => getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(`Player with id "${fakePlayerId}" not found : Game Play - Player in \`votes.target\` is not in the game players`);
    });

    it("should fill votes with game players when called.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: game.players[0]._id },
        ],
      });
      expect(getVotesWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toMatchObject<MakeGamePlayVoteWithRelationsDto[]>([
        { source: game.players[0], target: game.players[1] },
        { source: game.players[1], target: game.players[0] },
      ]);
    });
  });

  describe("getTargetsWithRelationsFromMakeGamePlayDto", () => {
    it("should return undefined when targets are undefined.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto();
      expect(getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toBeUndefined();
    });

    it("should throw error when targets contains one unknown player.", () => {
      const game = createFakeGame();
      const fakePlayerId = faker.database.mongodbObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        targets: [
          { playerId: game.players[0]._id },
          { playerId: game.players[1]._id },
          { playerId: fakePlayerId },
        ],
      });
      expect(() => getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(`Player with id "${fakePlayerId}" not found : Game Play - Player in \`targets.player\` is not in the game players`);
    });

    it("should fill targets with game players when called.", () => {
      const game = createFakeGame();
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        targets: [
          { playerId: game.players[0]._id, isInfected: true },
          { playerId: game.players[1]._id },
          { playerId: game.players[2]._id, drankPotion: WITCH_POTIONS.DEATH },
        ],
      });
      expect(getTargetsWithRelationsFromMakeGamePlayDto(makeGamePlayDto, game)).toMatchObject<MakeGamePlayTargetWithRelationsDto[]>([
        { player: game.players[0], isInfected: true },
        { player: game.players[1] },
        { player: game.players[2], drankPotion: WITCH_POTIONS.DEATH },
      ]);
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
      const fakeCardId = faker.database.mongodbObjectId();
      const makeGamePlayDto = createFakeMakeGamePlayDto({ chosenCardId: fakeCardId });
      expect(() => getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game)).toThrow(`Additional card with id "${fakeCardId}" not found : Game Play - Chosen card is not in the game additional cards`);
    });

    it("should return chosen card when called.", () => {
      const game = createFakeGame({ additionalCards: bulkCreateFakeGameAdditionalCards(4) });
      const makeGamePlayDto = createFakeMakeGamePlayDto({ chosenCardId: game.additionalCards?.[3]._id });
      expect(getChosenCardFromMakeGamePlayDto(makeGamePlayDto, game)).toStrictEqual(game.additionalCards?.[3]);
    });
  });

  describe("createMakeGamePlayDtoWithRelations", () => {
    it("should return same dto with relations when called.", () => {
      const game = createFakeGame({ additionalCards: bulkCreateFakeGameAdditionalCards(4) });
      const makeGamePlayDto = createFakeMakeGamePlayDto({
        votes: [
          { sourceId: game.players[0]._id, targetId: game.players[1]._id },
          { sourceId: game.players[1]._id, targetId: game.players[0]._id },
        ],
        targets: [
          { playerId: game.players[0]._id, isInfected: true },
          { playerId: game.players[1]._id },
          { playerId: game.players[2]._id, drankPotion: WITCH_POTIONS.DEATH },
        ],
        chosenCardId: game.additionalCards?.[3]._id,
        doesJudgeRequestAnotherVote: true,
        chosenSide: ROLE_SIDES.WEREWOLVES,
      });
      expect(createMakeGamePlayDtoWithRelations(makeGamePlayDto, game)).toMatchObject<MakeGamePlayWithRelationsDto>({
        votes: [
          { source: game.players[0], target: game.players[1] },
          { source: game.players[1], target: game.players[0] },
        ],
        targets: [
          { player: game.players[0], isInfected: true },
          { player: game.players[1] },
          { player: game.players[2], drankPotion: WITCH_POTIONS.DEATH },
        ],
        chosenCard: game.additionalCards?.[3],
        doesJudgeRequestAnotherVote: true,
        chosenSide: ROLE_SIDES.WEREWOLVES,
      });
    });
  });
});