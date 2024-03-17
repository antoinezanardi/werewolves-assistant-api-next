import type { FastifyAdapter } from "@nestjs/platform-fastify";

import { queryStringParser } from "@/server/helpers/server.helpers";

const FASTIFY_SERVER_DEFAULT_OPTIONS: Readonly<ConstructorParameters<typeof FastifyAdapter>[0]> = Object.freeze({ querystringParser: queryStringParser });

export { FASTIFY_SERVER_DEFAULT_OPTIONS };