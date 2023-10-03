import { ApiSortOrder } from "@/shared/api/enums/api.enum";
import { getMongooseSortValueFromApiSortOrder } from "@/shared/mongoose/helpers/mongoose.helper";

describe("Mongoose Helper", () => {
  describe("getMongooseSortValueFromApiSortOrder", () => {
    it("should return 1 when order is ASC.", () => {
      expect(getMongooseSortValueFromApiSortOrder(ApiSortOrder.ASC)).toBe(1);
    });

    it("should return -1 when order is DESC.", () => {
      expect(getMongooseSortValueFromApiSortOrder(ApiSortOrder.DESC)).toBe(-1);
    });
  });
});