import { IsOptional } from "class-validator";

class CreateDogWolfGameOptionsDto {
  @IsOptional()
  public isChosenSideRevealed?: boolean;
}

export { CreateDogWolfGameOptionsDto };