/* eslint-disable @typescript-eslint/naming-convention */
import { IsEnum, IsNumber, IsString } from "class-validator";
import { ENVIRONMENTS } from "./env.enum";

class EnvironmentVariables {
  @IsEnum(ENVIRONMENTS)
  public ENVIRONMENT: ENVIRONMENTS;

  @IsString()
  public DATABASE_HOST: string;

  @IsNumber()
  public DATABASE_PORT: number;

  @IsString()
  public DATABASE_USERNAME: string;

  @IsString()
  public DATABASE_PASSWORD: string;
}

export { EnvironmentVariables };