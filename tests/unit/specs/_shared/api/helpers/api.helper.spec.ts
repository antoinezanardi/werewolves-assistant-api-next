import { API_RESOURCES } from "../../../../../../src/_shared/api/enums/api.enum";
import { getResourceSingularForm } from "../../../../../../src/_shared/api/helpers/api.helper";

describe("API Helper", () => {
  describe("getResourceSingularForm", () => {
    it.each<{ resource: API_RESOURCES; singular: string }>([{ resource: API_RESOURCES.GAMES, singular: "game" }])("should return $singular when called with $resource [#$#].", ({ resource, singular }) => {
      expect(getResourceSingularForm(resource)).toBe(singular);
    });
  });
});