import { createInteractablePlayer } from "@/modules/game/helpers/game-play/game-play-eligible-targets/interactable-player/interactable-player.factory";
import type { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";

import { createFakeInteractablePlayer } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/interactable-player.schema.factory";
import { createFakePlayerInteraction } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/interactable-player/player-interaction/player-interaction.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Interactable Player Factory", () => {
  describe("createInteractablePlayer", () => {
    it("should create interactable player when called.", () => {
      const interactablePlayer: InteractablePlayer = {
        player: createFakePlayer(),
        interactions: [createFakePlayerInteraction()],
      };
      const expectedInteractablePlayer = createFakeInteractablePlayer(interactablePlayer);

      expect(createInteractablePlayer(interactablePlayer)).toStrictEqual<InteractablePlayer>(expectedInteractablePlayer);
    });
  });
});