import qs from "qs";

import { queryStringParser } from "@/server/helpers/server.helpers";

describe("Server Helper", () => {
  describe("queryStringParser", () => {
    let mocks: { qs: { parse: jest.SpyInstance } };

    beforeEach(() => {
      mocks = { qs: { parse: jest.spyOn(qs, "parse").mockImplementation() } };
    });

    it("should call qs parse method with specific options when called.", () => {
      queryStringParser("test");

      expect(mocks.qs.parse).toHaveBeenCalledExactlyOnceWith("test", {
        arrayLimit: 100,
        parameterLimit: 3000,
      });
    });
  });
});