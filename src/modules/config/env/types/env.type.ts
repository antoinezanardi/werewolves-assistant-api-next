/* eslint-disable @typescript-eslint/naming-convention */
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { Environnements } from "@/modules/config/env/enums/env.enum";

class EnvironmentVariables {
  @IsEnum(Environnements)
  public ENVIRONMENT: Environnements;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public HOST: string;

  @IsOptional()
  @IsNumber()
  public PORT: number;

  @IsString()
  @IsNotEmpty()
  public DATABASE_HOST: string;

  @IsOptional()
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