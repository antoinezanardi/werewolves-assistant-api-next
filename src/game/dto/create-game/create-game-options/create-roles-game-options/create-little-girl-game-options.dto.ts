import { IsOptional } from "class-validator";

class CreateLittleGirlGameOptionsDto {
  @IsOptional()
  public isProtectedByGuard?: boolean;
}

export { CreateLittleGirlGameOptionsDto };