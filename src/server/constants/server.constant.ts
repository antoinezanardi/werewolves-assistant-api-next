import type { FastifyServerOptions } from "fastify";

import { queryStringParser } from "@/server/helpers/server.helper";

const FASTIFY_SERVER_DEFAULT_OPTIONS: Readonly<FastifyServerOptions> = Object.freeze({ querystringParser: queryStringParser });

export { FASTIFY_SERVER_DEFAULT_OPTIONS };