import { plainToInstance } from "class-transformer";
import { EnvironmentVariables } from "../../../../src/config/env/env";
import { validate, getEnvPath } from "../../../../src/config/env/env.helper";

describe("Config Env Helper", () => {
  describe("validate", () => {
    it("should return the validated config when there is no error in env variables.", () => {
      const brutEnvVariables: Record<string, unknown> = {
        ENVIRONMENT: "test",
        DATABASE_HOST: "localhost",
        DATABASE_PORT: 666,
        DATABASE_USERNAME: "john",
        DATABASE_PASSWORD: "doe",
      };
      const validatedEnvVariables = plainToInstance(EnvironmentVariables, brutEnvVariables, { enableImplicitConversion: true });
      expect(validate(brutEnvVariables)).toStrictEqual(validatedEnvVariables);
    });

    it("should throw error when env variables is not valid.", () => {
      const brutEnvVariables: Record<string, unknown> = { ENVIRONMENT: "test" };
      expect(() => validate(brutEnvVariables)).toThrow("An instance of EnvironmentVariables has failed the validation");
    });
  });

  describe("getEnvPath", () => {
    const env = process.env;

    beforeEach(() => {
      process.env = { ...env };
    });

    afterEach(() => {
      process.env = env;
    });

    it("should return default development env path when NODE_ENV is undefined.", () => {
      process.env.NODE_ENV = undefined;
      expect(getEnvPath()).toBe("env/.env.development");
    });

    it("should return test env path when NODE_ENV is test.", () => {
      expect(getEnvPath()).toBe("env/.env.test");
    });
  });
});