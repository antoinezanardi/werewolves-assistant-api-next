import type { TransformFnParams } from "class-transformer/types/interfaces";
import { playerSideTransformer } from "../../../../../../../../../src/modules/game/dto/base/game-player/transformers/player-side.transformer";
import type { CreateGamePlayerSideDto } from "../../../../../../../../../src/modules/game/dto/create-game/create-game-player/create-game-player-side.dto/create-game-player-side.dto";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../../../../../src/modules/role/enums/role.enum";
import { createFakeCreateGamePlayerDto } from "../../../../../../../../factories/game/dto/create-game/create-game-player/create-game-player.dto.factory";

describe("Player Side Transformer", () => {
  describe("playerSideTransformer", () => {
    it("should fill player side with werewolf data when role is white werewolf.", () => {
      const player = createFakeCreateGamePlayerDto({ role: { name: ROLE_NAMES.WHITE_WEREWOLF } });
      expect(playerSideTransformer({ value: {}, obj: player } as TransformFnParams)).toStrictEqual<CreateGamePlayerSideDto>({
        current: ROLE_SIDES.WEREWOLVES,
        original: ROLE_SIDES.WEREWOLVES,
      });
    });

    it("should fill player side with villager data when role is witch.", () => {
      const player = createFakeCreateGamePlayerDto({ role: { name: ROLE_NAMES.WITCH } });
      expect(playerSideTransformer({ value: {}, obj: player } as TransformFnParams)).toStrictEqual<CreateGamePlayerSideDto>({
        current: ROLE_SIDES.VILLAGERS,
        original: ROLE_SIDES.VILLAGERS,
      });
    });
  });
});