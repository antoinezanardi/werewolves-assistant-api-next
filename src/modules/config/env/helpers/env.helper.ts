import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvironmentVariables } from "../types/env.type";

function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

function getEnvPath(): string {
  const basePath = "env/.env.";
  const envSuffix = process.env.NODE_ENV ?? "development";
  return `${basePath}${envSuffix}`;
}

function getEnvPaths(): string[] {
  const envPath = getEnvPath();
  return [envPath, `${envPath}.local`];
}

export { validate, getEnvPath, getEnvPaths };