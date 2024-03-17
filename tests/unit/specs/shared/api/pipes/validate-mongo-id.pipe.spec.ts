import { BadRequestException } from "@nestjs/common";
import type { Types } from "mongoose";

import { ValidateMongoId } from "@/shared/api/pipes/validate-mongo-id.pipe";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { createObjectIdFromString } from "@tests/helpers/mongoose/mongoose.helpers";

describe("Validate MongoId Pipe", () => {
  const pipe = new ValidateMongoId();

  describe("transform", () => {
    it.each<{
      test: string;
      value: Types.ObjectId | string;
      expected: Types.ObjectId;
    }>([
      {
        test: "should return the value as ObjectId when value is a correct MongoId (string).",
        value: "60f0c9b9e6b6f9a9e8a9e9a9",
        expected: createObjectIdFromString("60f0c9b9e6b6f9a9e8a9e9a9"),
      },
      {
        test: "should return the value as ObjectId when value is a correct MongoId (objectId).",
        value: createFakeObjectId("60f0c9b9e6b6f9a9e8a9e9a9"),
        expected: createFakeObjectId("60f0c9b9e6b6f9a9e8a9e9a9"),
      },
    ])("$test", ({ value, expected }) => {
      expect(pipe.transform(value)).toStrictEqual<Types.ObjectId>(expected);
    });

    it.each<{
      test: string;
      value: string | null;
      expected: BadRequestException;
    }>([
      {
        test: "should throw an error when value is a incorrect string MongoId.",
        value: "123",
        expected: new BadRequestException("Validation failed (Mongo ObjectId is expected)"),
      },
      {
        test: "should throw an error when value is null.",
        value: null,
        expected: new BadRequestException("Validation failed (Mongo ObjectId is expected)"),
      },
    ])("$test", ({ value, expected }) => {
      expect(() => pipe.transform(value)).toThrow(expected);
    });
  });
});