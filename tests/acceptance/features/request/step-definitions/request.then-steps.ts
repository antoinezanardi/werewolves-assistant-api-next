import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { SUCCESS_HTTP_STATUSES } from "@tests/acceptance/shared/constants/api.constants";
import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(/^the request should have succeeded with status code (?<statusCode>[0-9]{3})$/u, function(this: CustomWorld, statusCode: string): void {
  expect(SUCCESS_HTTP_STATUSES.includes(this.response.statusCode)).toBe(true);
  expect(this.response.statusCode).toBe(parseInt(statusCode));
});

Then(/^the request should have failed with status code (?<statusCode>[0-9]{3})$/u, function(this: CustomWorld, statusCode: string): void {
  expect(SUCCESS_HTTP_STATUSES.includes(this.response.statusCode)).toBe(false);
  expect(this.response.statusCode).toBe(parseInt(statusCode));
});