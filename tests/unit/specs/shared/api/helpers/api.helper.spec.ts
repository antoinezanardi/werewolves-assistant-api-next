import { API_RESOURCES } from "@/shared/api/enums/api.enum";
import { getResourceSingularForm } from "@/shared/api/helpers/api.helper";

describe("API Helper", () => {
  describe("getResourceSingularForm", () => {
    it.each<{ resource: API_RESOURCES; singular: string }>([
      { resource: API_RESOURCES.GAMES, singular: "game" },
      { resource: API_RESOURCES.PLAYERS, singular: "player" },
      { resource: API_RESOURCES.GAME_ADDITIONAL_CARDS, singular: "additional card" },
      { resource: API_RESOURCES.ROLES, singular: "role" },
      { resource: API_RESOURCES.HEALTH, singular: "health" },
    ])("should return $singular when called with $resource [#$#].", ({ resource, singular }) => {
      expect(getResourceSingularForm(resource)).toBe(singular);
    });
  });
});