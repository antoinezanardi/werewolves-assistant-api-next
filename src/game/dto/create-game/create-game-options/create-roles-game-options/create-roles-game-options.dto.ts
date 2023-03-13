import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { rolesGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/roles-game-options.constant";
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
  @ApiProperty(rolesGameOptionsApiProperties.areRevealedOnDeath)
  @IsOptional()
  public areRevealedOnDeath?: boolean;

  @ApiProperty(rolesGameOptionsApiProperties.sheriff)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSheriffGameOptionsDto)
  public sheriff?: CreateSheriffGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.bigBadWolf)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBigBadWolfGameOptionsDto)
  public bigBadWolf?: CreateBigBadWolfGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.whiteWerewolf)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateWhiteWerewolfGameOptionsDto)
  public whiteWerewolf?: CreateWhiteWerewolfGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.seer)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSeerGameOptionsDto)
  public seer?: CreateSeerGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.littleGirl)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLittleGirlGameOptionsDto)
  public littleGirl?: CreateLittleGirlGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.guard)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateGuardGameOptionsDto)
  public guard?: CreateGuardGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.ancient)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAncientGameOptionsDto)
  public ancient?: CreateAncientGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.idiot)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateIdiotGameOptionsDto)
  public idiot?: CreateIdiotGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.twoSisters)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTwoSistersGameOptionsDto)
  public twoSisters?: CreateTwoSistersGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.threeBrothers)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateThreeBrothersGameOptionsDto)
  public threeBrothers?: CreateThreeBrothersGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.fox)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFoxGameOptionsDto)
  public fox?: CreateFoxGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.bearTamer)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBearTamerGameOptionsDto)
  public bearTamer?: CreateBearTamerGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.stutteringJudge)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStutteringJudgeGameOptionsDto)
  public stutteringJudge?: CreateStutteringJudgeGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.wildChild)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateWildChildGameOptionsDto)
  public wildChild?: CreateWildChildGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.dogWolf)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDogWolfGameOptionsDto)
  public dogWolf?: CreateDogWolfGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.thief)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateThiefGameOptionsDto)
  public thief?: CreateThiefGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.piedPiper)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePiedPiperGameOptionsDto)
  public piedPiper?: CreatePiedPiperGameOptionsDto;

  @ApiProperty(rolesGameOptionsApiProperties.raven)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRavenGameOptionsDto)
  public raven?: CreateRavenGameOptionsDto;
}

export { CreateRolesGameOptionsDto };