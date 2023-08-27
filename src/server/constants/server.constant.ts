import type { FastifyServerOptions } from "fastify";

import { queryStringParser } from "@/server/helpers/server.helper";

const fastifyServerDefaultOptions: Readonly<FastifyServerOptions> = Object.freeze({ querystringParser: queryStringParser });

export { fastifyServerDefaultOptions };