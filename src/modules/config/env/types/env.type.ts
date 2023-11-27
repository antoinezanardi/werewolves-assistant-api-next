/* eslint-disable @typescript-eslint/naming-convention */
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

import { DEFAULT_APP_HOST, DEFAULT_APP_PORT, MAX_PORT_VALUE, MIN_PORT_VALUE } from "@/modules/config/env/constants/env.constant";
import { Environnements } from "@/modules/config/env/enums/env.enum";

class EnvironmentVariables {
  @IsEnum(Environnements)
  public ENVIRONMENT: Environnements;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public HOST: string = DEFAULT_APP_HOST;

  @IsOptional()
  @IsNumber()
  @Min(MIN_PORT_VALUE)
  @Max(MAX_PORT_VALUE)
  public PORT: number = DEFAULT_APP_PORT;

  @IsString()
  @IsNotEmpty()
  public DATABASE_HOST: string;

  @IsOptional()
  @IsNumber()
  @Min(MIN_PORT_VALUE)
  @Max(MAX_PORT_VALUE)
  public DATABASE_PORT?: number;

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