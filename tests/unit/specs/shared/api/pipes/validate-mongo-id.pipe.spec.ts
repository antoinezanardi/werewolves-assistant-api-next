import { faker } from "@faker-js/faker";
import { ValidateMongoId } from "../../../../../../src/shared/api/pipes/validate-mongo-id.pipe";

describe("Validate MongoId Pipe", () => {
  const pipe = new ValidateMongoId();

  describe("transform", () => {
    it("should return the value as is when value is a correct MongoId.", () => {
      const validObjectId = faker.database.mongodbObjectId();
      expect(pipe.transform(validObjectId)).toBe(validObjectId);
    });

    it("should throw an error when value is a incorrect MongoId.", () => {
      expect(() => pipe.transform("123")).toThrow("Validation failed (Mongo ObjectId is expected)");
    });
  });
});