import { ApiSortOrder } from "@/shared/api/enums/api.enum";
import { getMongooseSortValueFromApiSortOrder } from "@/shared/mongoose/helpers/mongoose.helpers";

describe("Mongoose Helper", () => {
  describe("getMongooseSortValueFromApiSortOrder", () => {
    it.each<{
      test: string;
      sortOrder: ApiSortOrder;
      expected: number;
    }>([
      {
        test: "should return 1 when order is ASC.",
        sortOrder: ApiSortOrder.ASC,
        expected: 1,
      },
      {
        test: "should return -1 when order is DESC.",
        sortOrder: ApiSortOrder.DESC,
        expected: -1,
      },
    ])("$test", ({ sortOrder, expected }) => {
      expect(getMongooseSortValueFromApiSortOrder(sortOrder)).toBe(expected);
    });
  });
});