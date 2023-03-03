import { NestFactory } from "@nestjs/core";
import { bootstrap } from "../../src/server";

jest.mock("@nestjs/core");
describe("Server", () => {
  describe("bootstrap", () => {
    it("should call listen with the default port when no port is provided.", async() => {
      const listen = jest.fn();
      (NestFactory.create as jest.Mock).mockResolvedValue({ listen });
      await bootstrap();
      expect(listen).toHaveBeenCalledWith(3000);
    });

    it("should call listen with 4000 when port 4000 is provided.", async() => {
      const listen = jest.fn();
      (NestFactory.create as jest.Mock).mockResolvedValue({ listen });
      await bootstrap(4000);
      expect(listen).toHaveBeenCalledWith(4000);
    });
  });
});