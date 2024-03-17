import type { ApiPropertyOptions } from "@nestjs/swagger";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { convertMongoosePropOptionsToApiPropertyOptions, getResourceSingularForm } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

describe("API Helper", () => {
  describe("getResourceSingularForm", () => {
    it.each<{
      test: string;
      resource: ApiResources;
      expected: string;
    }>([
      {
        test: "should return game when called with games",
        resource: ApiResources.GAMES,
        expected: "game",
      },
      {
        test: "should return player when called with players",
        resource: ApiResources.PLAYERS,
        expected: "player",
      },
      {
        test: "should return additional card when called with game-additional-cards",
        resource: ApiResources.GAME_ADDITIONAL_CARDS,
        expected: "additional card",
      },
      {
        test: "should return role when called with roles",
        resource: ApiResources.ROLES,
        expected: "role",
      },
      {
        test: "should return health when called with health",
        resource: ApiResources.HEALTH,
        expected: "health",
      },
    ])("$test", ({ resource, expected }) => {
      expect(getResourceSingularForm(resource)).toBe(expected);
    });
  });

  describe("convertMongoosePropOptionsToApiPropertyOptions", () => {
    it("should convert mongoose prop options to api property options when called.", () => {
      const mongoosePropOptions: MongoosePropOptions = {
        required: true,
        default: "default",
        enum: ["enum1", "enum2"],
        min: 1,
        max: 10,
      };

      const expectedApiPropertyOptions: ApiPropertyOptions = {
        required: true,
        default: "default",
        enum: ["enum1", "enum2"],
        minimum: 1,
        maximum: 10,
        minItems: undefined,
        maxItems: undefined,
      };

      expect(convertMongoosePropOptionsToApiPropertyOptions(mongoosePropOptions)).toStrictEqual<ApiPropertyOptions>(expectedApiPropertyOptions);
    });
  });
});