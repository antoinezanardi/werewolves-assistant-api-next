import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { CreateAncientGameOptionsDto } from "./create-ancient-game-options.dto";
import { CreateBearTamerGameOptionsDto } from "./create-bear-tamer-game-options.dto";
import { CreateBigBadWolfGameOptionsDto } from "./create-big-bad-wolf-game-options.dto";
import { CreateDogWolfGameOptionsDto } from "./create-dog-wolf-game-options.dto";
import { CreateFoxGameOptionsDto } from "./create-fox-game-options.dto";
import { CreateGuardGameOptionsDto } from "./create-guard-game-options.dto";
import { CreateIdiotGameOptionsDto } from "./create-idiot-game-options.dto";
import { CreateLittleGirlGameOptionsDto } from "./create-little-girl-game-options.dto";
import { CreatePiedPiperGameOptionsDto } from "./create-pied-piper-game-options.dto";
import { CreateRavenGameOptionsDto } from "./create-raven-game-options.dto";
import { CreateSeerGameOptionsDto } from "./create-seer-game-options.dto";
import { CreateSheriffGameOptionsDto } from "./create-sheriff-game-options/create-sheriff-game-options.dto";
import { CreateStutteringJudgeGameOptionsDto } from "./create-stuttering-judge-game-options.dto";
import { CreateThiefGameOptionsDto } from "./create-thief-game-options.dto";
import { CreateThreeBrothersGameOptionsDto } from "./create-three-brothers-game-options.dto";
import { CreateTwoSistersGameOptionsDto } from "./create-two-sisters-game-options.dto";
import { CreateWhiteWerewolfGameOptionsDto } from "./create-white-werewolf-game-options.dto";
import { CreateWildChildGameOptionsDto } from "./create-wild-child-game-options.dto";

class CreateRolesGameOptionsDto {
  @IsOptional()
  public areRevealedOnDeath?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSheriffGameOptionsDto)
  public sheriff?: CreateSheriffGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBigBadWolfGameOptionsDto)
  public bigBadWolf?: CreateBigBadWolfGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateWhiteWerewolfGameOptionsDto)
  public whiteWerewolf?: CreateWhiteWerewolfGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSeerGameOptionsDto)
  public seer?: CreateSeerGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLittleGirlGameOptionsDto)
  public littleGirl?: CreateLittleGirlGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateGuardGameOptionsDto)
  public guard?: CreateGuardGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAncientGameOptionsDto)
  public ancient?: CreateAncientGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateIdiotGameOptionsDto)
  public idiot?: CreateIdiotGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTwoSistersGameOptionsDto)
  public twoSisters?: CreateTwoSistersGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateThreeBrothersGameOptionsDto)
  public threeBrothers?: CreateThreeBrothersGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFoxGameOptionsDto)
  public fox?: CreateFoxGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBearTamerGameOptionsDto)
  public bearTamer?: CreateBearTamerGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStutteringJudgeGameOptionsDto)
  public stutteringJudge?: CreateStutteringJudgeGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateWildChildGameOptionsDto)
  public wildChild?: CreateWildChildGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDogWolfGameOptionsDto)
  public dogWolf?: CreateDogWolfGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateThiefGameOptionsDto)
  public thief?: CreateThiefGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePiedPiperGameOptionsDto)
  public piedPiper?: CreatePiedPiperGameOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRavenGameOptionsDto)
  public raven?: CreateRavenGameOptionsDto;
}

export { CreateRolesGameOptionsDto };