import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

function createFakeObjectId(objectId?: Types.ObjectId | string): Types.ObjectId {
  if (objectId !== undefined) {
    return new Types.ObjectId(objectId);
  }
  return new Types.ObjectId(faker.database.mongodbObjectId());
}

export { createFakeObjectId };