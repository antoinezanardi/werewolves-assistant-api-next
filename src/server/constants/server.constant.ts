import type { FastifyServerOptions } from "fastify";
import { queryStringParser } from "../helpers/server.helper";

const fastifyServerDefaultOptions: Readonly<FastifyServerOptions> = Object.freeze({ querystringParser: queryStringParser });

export { fastifyServerDefaultOptions };