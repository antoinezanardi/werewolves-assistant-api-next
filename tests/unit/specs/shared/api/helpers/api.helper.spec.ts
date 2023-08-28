import { ApiResources } from "@/shared/api/enums/api.enum";
import { getResourceSingularForm } from "@/shared/api/helpers/api.helper";

describe("API Helper", () => {
  describe("getResourceSingularForm", () => {
    it.each<{ resource: ApiResources; singular: string }>([
      { resource: ApiResources.GAMES, singular: "game" },
      { resource: ApiResources.PLAYERS, singular: "player" },
      { resource: ApiResources.GAME_ADDITIONAL_CARDS, singular: "additional card" },
      { resource: ApiResources.ROLES, singular: "role" },
      { resource: ApiResources.HEALTH, singular: "health" },
    ])("should return $singular when called with $resource [#$#].", ({ resource, singular }) => {
      expect(getResourceSingularForm(resource)).toBe(singular);
    });
  });
});