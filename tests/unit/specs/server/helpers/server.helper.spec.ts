import qs from "qs";
import { queryStringParser } from "../../../../../src/server/helpers/server.helper";

describe("Server Helper", () => {
  describe("queryStringParser", () => {
    let parseMock: jest.SpyInstance;

    beforeEach(() => {
      parseMock = jest.spyOn(qs, "parse").mockImplementation();
    });

    it("should call qs parse method with specific options when called.", () => {
      queryStringParser("test");
      expect(parseMock).toHaveBeenCalledWith("test", {
        arrayLimit: 100,
        parameterLimit: 3000,
      });
    });
  });
});