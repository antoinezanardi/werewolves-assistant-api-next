import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

import { rolesGameOptionsApiProperties, rolesGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/roles-game-options.constant";
import { CreateAncientGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-ancient-game-options.dto";
import { CreateBearTamerGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-bear-tamer-game-options.dto";
import { CreateBigBadWolfGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-big-bad-wolf-game-options.dto";
import { CreateDogWolfGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-dog-wolf-game-options.dto";
import { CreateFoxGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-fox-game-options.dto";
import { CreateGuardGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-guard-game-options.dto";
import { CreateIdiotGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-idiot-game-options.dto";
import { CreateLittleGirlGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-little-girl-game-options.dto";
import { CreatePiedPiperGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-pied-piper-game-options.dto";
import { CreateRavenGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-raven-game-options.dto";
import { CreateSeerGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-seer-game-options.dto";
import { CreateSheriffGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-sheriff-game-options/create-sheriff-game-options.dto";
import { CreateStutteringJudgeGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-stuttering-judge-game-options.dto";
import { CreateThiefGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-thief-game-options.dto";
import { CreateThreeBrothersGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-three-brothers-game-options.dto";
import { CreateTwoSistersGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-two-sisters-game-options.dto";
import { CreateWhiteWerewolfGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-white-werewolf-game-options.dto";
import { CreateWildChildGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-wild-child-game-options.dto";

class CreateRolesGameOptionsDto {
  @ApiProperty({
    ...rolesGameOptionsApiProperties.doSkipCallIfNoTarget,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public doSkipCallIfNoTarget: boolean = rolesGameOptionsFieldsSpecs.doSkipCallIfNoTarget.default;
  
  @ApiProperty({
    ...rolesGameOptionsApiProperties.areRevealedOnDeath,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public areRevealedOnDeath: boolean = rolesGameOptionsFieldsSpecs.areRevealedOnDeath.default;

  @ApiProperty({
    ...rolesGameOptionsApiProperties.sheriff,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateSheriffGameOptionsDto)
  @ValidateNested()
  public sheriff: CreateSheriffGameOptionsDto = new CreateSheriffGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.bigBadWolf,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateBigBadWolfGameOptionsDto)
  @ValidateNested()
  public bigBadWolf: CreateBigBadWolfGameOptionsDto = new CreateBigBadWolfGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.whiteWerewolf,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateWhiteWerewolfGameOptionsDto)
  @ValidateNested()
  public whiteWerewolf: CreateWhiteWerewolfGameOptionsDto = new CreateWhiteWerewolfGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.seer,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateSeerGameOptionsDto)
  @ValidateNested()
  public seer: CreateSeerGameOptionsDto = new CreateSeerGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.littleGirl,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateLittleGirlGameOptionsDto)
  @ValidateNested()
  public littleGirl: CreateLittleGirlGameOptionsDto = new CreateLittleGirlGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.guard,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateGuardGameOptionsDto)
  @ValidateNested()
  public guard: CreateGuardGameOptionsDto = new CreateGuardGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.ancient,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateAncientGameOptionsDto)
  @ValidateNested()
  public ancient: CreateAncientGameOptionsDto = new CreateAncientGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.idiot,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateIdiotGameOptionsDto)
  @ValidateNested()
  public idiot: CreateIdiotGameOptionsDto = new CreateIdiotGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.twoSisters,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateTwoSistersGameOptionsDto)
  @ValidateNested()
  public twoSisters: CreateTwoSistersGameOptionsDto = new CreateTwoSistersGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.threeBrothers,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateThreeBrothersGameOptionsDto)
  @ValidateNested()
  public threeBrothers: CreateThreeBrothersGameOptionsDto = new CreateThreeBrothersGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.fox,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateFoxGameOptionsDto)
  @ValidateNested()
  public fox: CreateFoxGameOptionsDto = new CreateFoxGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.bearTamer,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateBearTamerGameOptionsDto)
  @ValidateNested()
  public bearTamer: CreateBearTamerGameOptionsDto = new CreateBearTamerGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.stutteringJudge,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateStutteringJudgeGameOptionsDto)
  @ValidateNested()
  public stutteringJudge: CreateStutteringJudgeGameOptionsDto = new CreateStutteringJudgeGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.wildChild,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateWildChildGameOptionsDto)
  @ValidateNested()
  public wildChild: CreateWildChildGameOptionsDto = new CreateWildChildGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.dogWolf,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateDogWolfGameOptionsDto)
  @ValidateNested()
  public dogWolf: CreateDogWolfGameOptionsDto = new CreateDogWolfGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.thief,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateThiefGameOptionsDto)
  @ValidateNested()
  public thief: CreateThiefGameOptionsDto = new CreateThiefGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.piedPiper,
    required: false,
  })
  @IsOptional()
  @Type(() => CreatePiedPiperGameOptionsDto)
  @ValidateNested()
  public piedPiper: CreatePiedPiperGameOptionsDto = new CreatePiedPiperGameOptionsDto();

  @ApiProperty({
    ...rolesGameOptionsApiProperties.raven,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateRavenGameOptionsDto)
  @ValidateNested()
  public raven: CreateRavenGameOptionsDto = new CreateRavenGameOptionsDto();
}

export { CreateRolesGameOptionsDto };