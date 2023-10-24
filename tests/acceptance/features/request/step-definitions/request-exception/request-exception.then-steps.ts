import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { CustomWorld } from "@tests/acceptance/shared/types/world.types";

Then(/^the request exception message should be "(?<message>.+)"$/u, function(this: CustomWorld, message: string): void {
  expect(this.responseException.message).toBe(message);
});

Then(/^the request exception error should be "(?<error>.+)"$/u, function(this: CustomWorld, error: string): void {
  expect(this.responseException.error).toBe(error);
});

Then(/^the request exception status code should be (?<statusCode>[0-9]{3})$/u, function(this: CustomWorld, statusCode: string): void {
  expect(this.responseException.statusCode).toBe(parseInt(statusCode));
});