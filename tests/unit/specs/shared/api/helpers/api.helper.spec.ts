import { ApiResources } from "@/shared/api/enums/api.enum";
import { convertMongoosePropOptionsToApiPropertyOptions, getResourceSingularForm } from "@/shared/api/helpers/api.helper";

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

  describe("convertMongoosePropOptionsToApiPropertyOptions", () => {
    it("should convert mongoose prop options to api property options when called.", () => {
      const mongoosePropOptions = {
        required: true,
        default: "default",
        enum: ["enum1", "enum2"],
        min: 1,
        max: 10,
      };

      const expectedApiPropertyOptions = {
        required: true,
        default: "default",
        enum: ["enum1", "enum2"],
        minimum: 1,
        maximum: 10,
        minItems: undefined,
        maxItems: undefined,
      };

      expect(convertMongoosePropOptionsToApiPropertyOptions(mongoosePropOptions)).toStrictEqual(expectedApiPropertyOptions);
    });
  });
});