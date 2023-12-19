import { createDeadPlayer, createPlayer } from "@/modules/game/helpers/player/player.factory";
import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";

import { createFakePowerlessByFoxPlayerAttribute } from "@tests/factories/game/schemas/player/player-attribute/player-attribute.schema.factory";
import { createFakePlayerDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";
import { createFakeDeadPlayer, createFakePlayer, createFakePlayerRole, createFakePlayerSide } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

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

    it("should create a player without extraneous properties when called.", () => {
      const player: Player = {
        _id: createFakeObjectId(),
        name: "Toto",
        role: createFakePlayerRole(),
        side: createFakePlayerSide(),
        isAlive: true,
        attributes: [createFakePowerlessByFoxPlayerAttribute()],
        position: 1,
      };
      const playerWithExtraProperties = { ...player, extra: "extra" };

      expect(createPlayer(playerWithExtraProperties)).toStrictEqual<Player>(createFakePlayer(player));
    });
  });

  describe("createDeadPlayer", () => {
    it("should create a dead player when called.", () => {
      const player: DeadPlayer = {
        _id: createFakeObjectId(),
        name: "Toto",
        role: createFakePlayerRole(),
        side: createFakePlayerSide(),
        isAlive: false,
        attributes: [createFakePowerlessByFoxPlayerAttribute()],
        death: createFakePlayerDeath(),
        position: 1,
      };

      expect(createDeadPlayer(player)).toStrictEqual<DeadPlayer>(createFakeDeadPlayer(player));
    });

    it("should create a dead player without extraneous properties when called.", () => {
      const player: DeadPlayer = {
        _id: createFakeObjectId(),
        name: "Toto",
        role: createFakePlayerRole(),
        side: createFakePlayerSide(),
        isAlive: false,
        attributes: [createFakePowerlessByFoxPlayerAttribute()],
        death: createFakePlayerDeath(),
        position: 1,
      };
      const playerWithExtraProperties = { ...player, extra: "extra" };

      expect(createDeadPlayer(playerWithExtraProperties)).toStrictEqual<DeadPlayer>(createFakeDeadPlayer(player));
    });
  });
});