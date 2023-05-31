import type { PipeTransform } from "@nestjs/common";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
class ValidateMongoId implements PipeTransform<string> {
  public transform(value: unknown): Types.ObjectId {
    if ((typeof value === "string" || value instanceof Types.ObjectId) && Types.ObjectId.isValid(value)) {
      return new Types.ObjectId(value);
    }
    throw new BadRequestException("Validation failed (Mongo ObjectId is expected)");
  }
}

export { ValidateMongoId };