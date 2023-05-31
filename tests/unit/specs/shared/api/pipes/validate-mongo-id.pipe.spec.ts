import { faker } from "@faker-js/faker";
import { BadRequestException } from "@nestjs/common";
import { ValidateMongoId } from "../../../../../../src/shared/api/pipes/validate-mongo-id.pipe";
import { createObjectIdFromString } from "../../../../../helpers/mongoose/mongoose.helper";

describe("Validate MongoId Pipe", () => {
  const pipe = new ValidateMongoId();

  describe("transform", () => {
    it("should return the value as ObjectId when value is a correct MongoId (string).", () => {
      const validStringObjectId = faker.database.mongodbObjectId();

      expect(pipe.transform(validStringObjectId)).toStrictEqual(createObjectIdFromString(validStringObjectId));
    });

    it("should return the value as ObjectId when value is a correct MongoId (objectId).", () => {
      const validObjectId = createObjectIdFromString(faker.database.mongodbObjectId());

      expect(pipe.transform(validObjectId)).toStrictEqual(validObjectId);
    });

    it("should throw an error when value is a incorrect string MongoId.", () => {
      const expectedError = new BadRequestException("Validation failed (Mongo ObjectId is expected)");

      expect(() => pipe.transform("123")).toThrow(expectedError);
    });

    it("should throw an error when value is null.", () => {
      const expectedError = new BadRequestException("Validation failed (Mongo ObjectId is expected)");

      expect(() => pipe.transform(null)).toThrow(expectedError);
    });
  });
});