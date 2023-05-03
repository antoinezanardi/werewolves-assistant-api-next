import { faker } from "@faker-js/faker";
import { ValidateMongoId } from "../../../../../../src/shared/api/pipes/validate-mongo-id.pipe";
import { createObjectIdFromString } from "../../../../../helpers/mongoose/mongoose.helper";

describe("Validate MongoId Pipe", () => {
  const pipe = new ValidateMongoId();

  describe("transform", () => {
    it("should return the value as ObjectId when value is a correct MongoId.", () => {
      const validObjectId = faker.database.mongodbObjectId();
      expect(pipe.transform(validObjectId)).toStrictEqual(createObjectIdFromString(validObjectId));
    });

    it("should throw an error when value is a incorrect MongoId.", () => {
      expect(() => pipe.transform("123")).toThrow("Validation failed (Mongo ObjectId is expected)");
    });
  });
});