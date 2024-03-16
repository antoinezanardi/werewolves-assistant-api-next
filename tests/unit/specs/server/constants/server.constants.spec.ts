import type { FastifyServerOptions } from "fastify";

import { FASTIFY_SERVER_DEFAULT_OPTIONS } from "@/server/constants/server.constants";

describe("Server Constant", () => {
  describe("fastifyServerDefaultOptions", () => {
    it("should get fastify server default options when called.", () => {
      expect(FASTIFY_SERVER_DEFAULT_OPTIONS).toStrictEqual<FastifyServerOptions>({ querystringParser: expect.any(Function) as (string) => Record<string, unknown> });
    });
  });
});