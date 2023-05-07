import type { FastifyServerOptions } from "fastify";
import { fastifyServerDefaultOptions } from "../../../../../src/server/constants/server.constant";

describe("Server Constant", () => {
  describe("fastifyServerDefaultOptions", () => {
    it("should get fastify server default options when called.", () => {
      expect(fastifyServerDefaultOptions).toStrictEqual<FastifyServerOptions>({ querystringParser: expect.any(Function) as (string) => Record<string, unknown> });
    });
  });
});