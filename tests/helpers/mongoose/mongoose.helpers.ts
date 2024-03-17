import { Types } from "mongoose";

function createObjectIdFromString(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

export { createObjectIdFromString };