import { plainToInstance } from "class-transformer";

import { validate, getEnvPath, getEnvPaths } from "@/modules/config/env/helpers/env.helper";
import { EnvironmentVariables } from "@/modules/config/env/types/env.type";

describe("Config Env Helper", () => {
  describe("validate", () => {
    const validEnvVariables: Record<string, unknown> = {
      ENVIRONMENT: "test",
      HOST: "0.0.0.0",
      PORT: "1234",
      DATABASE_HOST: "localhost",
      DATABASE_PORT: "27001",
      DATABASE_NAME: "db",
      DATABASE_USERNAME: "john",
      DATABASE_PASSWORD: "doe",
    };

    it("should return the validated config when there is no error in env variables.", () => {
      const validatedEnvVariables = plainToInstance(EnvironmentVariables, validEnvVariables, { enableImplicitConversion: true });

      expect(validate(validEnvVariables)).toStrictEqual(validatedEnvVariables);
    });

    it("should return the validated config with default values when there is no error in env variables.", () => {
      const validEnvVariablesWithoutOptional = {
        ENVIRONMENT: "test",
        DATABASE_HOST: "localhost",
        DATABASE_NAME: "db",
        DATABASE_USERNAME: "john",
        DATABASE_PASSWORD: "doe",
      };
      const expectedValidatedEnvVariables = plainToInstance(EnvironmentVariables, {
        ...validEnvVariablesWithoutOptional,
        HOST: "127.0.0.1",
        PORT: 8080,
        DATABASE_PORT: undefined,
      }, { enableImplicitConversion: true });

      expect(validate(validEnvVariablesWithoutOptional)).toStrictEqual(expectedValidatedEnvVariables);
    });

    it.each<{ badEnvVariables: Record<string, unknown>; test: string }>([
      {
        badEnvVariables: {
          ...validEnvVariables,
          ENVIRONMENT: undefined,
        },
        test: "ENVIRONMENT is not defined",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          ENVIRONMENT: "bad-env",
        },
        test: "ENVIRONMENT is not a valid enum value",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          HOST: "",
        },
        test: "HOST is empty",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          PORT: "bad-port",
        },
        test: "PORT is not a number",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          PORT: "-1",
        },
        test: "PORT is less than min value",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          PORT: "65536",
        },
        test: "PORT is greater than max value",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_HOST: undefined,
        },
        test: "DATABASE_HOST is not defined",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_HOST: "",
        },
        test: "DATABASE_HOST is empty",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_PORT: "bad-port",
        },
        test: "DATABASE_PORT is not a number",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_PORT: "-1",
        },
        test: "DATABASE_PORT is less than min value",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_PORT: "65536",
        },
        test: "DATABASE_PORT is greater than max value",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_NAME: undefined,
        },
        test: "DATABASE_NAME is not defined",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_NAME: "",
        },
        test: "DATABASE_NAME is empty",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_USERNAME: undefined,
        },
        test: "DATABASE_USERNAME is not defined",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_USERNAME: "",
        },
        test: "DATABASE_USERNAME is empty",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_PASSWORD: undefined,
        },
        test: "DATABASE_PASSWORD is not defined",
      },
      {
        badEnvVariables: {
          ...validEnvVariables,
          DATABASE_PASSWORD: "",
        },
        test: "DATABASE_PASSWORD is empty",
      },
    ])("should throw validate error when $test [#$#].", ({ badEnvVariables }) => {
      expect(() => validate(badEnvVariables)).toThrow("An instance of EnvironmentVariables has failed the validation");
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

  describe("getEnvPaths", () => {
    it("should return default and local test env paths when function is called.", () => {
      expect(getEnvPaths()).toStrictEqual(["env/.env.test", "env/.env.test.local"]);
    });
  });
});