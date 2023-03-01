/* eslint-disable @typescript-eslint/naming-convention */
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ENVIRONMENTS } from "./env.enum";

class EnvironmentVariables {
  @IsEnum(ENVIRONMENTS)
  public ENVIRONMENT: ENVIRONMENTS;

  @IsString()
  @IsNotEmpty()
  public DATABASE_HOST: string;

  @IsNumber()
  public DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  public DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  public DATABASE_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  public DATABASE_PASSWORD: string;
}

export { EnvironmentVariables };