import type { IParseOptions } from "qs";
import { parse } from "qs";

function queryStringParser(query: string): Record<string, unknown> {
  const parseOptions: IParseOptions = {
    arrayLimit: 100,
    parameterLimit: 3000,
  };
  return parse(query, parseOptions);
}

export { queryStringParser };