import { createPlayer } from "../../../../../../../src/modules/game/helpers/player/player.factory";
import type { Player } from "../../../../../../../src/modules/game/schemas/player/player.schema";
import { createFakePowerlessByFoxPlayerAttribute } from "../../../../../../factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayer, createFakePlayerRole, createFakePlayerSide } from "../../../../../../factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "../../../../../../factories/shared/mongoose/mongoose.factory";

describe("Player Factory", () => {
  describe("createPlayer", () => {
    it("should create a player when called.", () => {
      const player: Player = {
        _id: createFakeObjectId(),
        name: "Toto",
        role: createFakePlayerRole(),
        side: createFakePlayerSide(),
        isAlive: true,
        attributes: [createFakePowerlessByFoxPlayerAttribute()],
        position: 1,
      };
      
      expect(createPlayer(player)).toStrictEqual<Player>(createFakePlayer(player));
    });
  });
});