import { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Make Game Play With Relations Dto", () => {
  describe("create", () => {
    it("should create instance when called.", () => {
      const expectedMakeGamePlayTargetWithRelationsDto = new MakeGamePlayTargetWithRelationsDto();
      const player = createFakePlayer();
      expectedMakeGamePlayTargetWithRelationsDto.player = player;
      expectedMakeGamePlayTargetWithRelationsDto.drankPotion = "life";
      const makeGamePlayTargetWithRelationsDto = MakeGamePlayTargetWithRelationsDto.create({
        player,
        drankPotion: "life",
      });

      expect(makeGamePlayTargetWithRelationsDto).toStrictEqual<MakeGamePlayTargetWithRelationsDto>(expectedMakeGamePlayTargetWithRelationsDto);
    });
  });
});