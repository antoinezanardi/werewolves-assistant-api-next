import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

import { CreateActorGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-actor-game-options.dto";
import { CreatePrejudicedManipulatorGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-prejudiced-manipulator-game-options.dto";
import { CreateCupidGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-cupid-game-options/create-cupid-game-options.dto";
import { CreateWitchGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-witch-game-options.dto";
import { ROLES_GAME_OPTIONS_API_PROPERTIES, ROLES_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema.constants";
import { CreateElderGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-elder-game-options.dto";
import { CreateBearTamerGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-bear-tamer-game-options.dto";
import { CreateBigBadWolfGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-big-bad-wolf-game-options.dto";
import { CreateWolfHoundGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-wolf-hound-game-options.dto";
import { CreateFoxGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-fox-game-options.dto";
import { CreateDefenderGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-defender-game-options.dto";
import { CreateIdiotGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-idiot-game-options.dto";
import { CreateLittleGirlGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-little-girl-game-options.dto";
import { CreatePiedPiperGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-pied-piper-game-options.dto";
import { CreateScandalmongerGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-scandalmonger-game-options.dto";
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
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.doSkipCallIfNoTarget,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public doSkipCallIfNoTarget: boolean = ROLES_GAME_OPTIONS_FIELDS_SPECS.doSkipCallIfNoTarget.default;

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.areRevealedOnDeath,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public areRevealedOnDeath: boolean = ROLES_GAME_OPTIONS_FIELDS_SPECS.areRevealedOnDeath.default;

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.sheriff,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateSheriffGameOptionsDto)
  @ValidateNested()
  public sheriff: CreateSheriffGameOptionsDto = new CreateSheriffGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.bigBadWolf,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateBigBadWolfGameOptionsDto)
  @ValidateNested()
  public bigBadWolf: CreateBigBadWolfGameOptionsDto = new CreateBigBadWolfGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.whiteWerewolf,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateWhiteWerewolfGameOptionsDto)
  @ValidateNested()
  public whiteWerewolf: CreateWhiteWerewolfGameOptionsDto = new CreateWhiteWerewolfGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.seer,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateSeerGameOptionsDto)
  @ValidateNested()
  public seer: CreateSeerGameOptionsDto = new CreateSeerGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.cupid,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateCupidGameOptionsDto)
  @ValidateNested()
  public cupid: CreateCupidGameOptionsDto = new CreateCupidGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.littleGirl,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateLittleGirlGameOptionsDto)
  @ValidateNested()
  public littleGirl: CreateLittleGirlGameOptionsDto = new CreateLittleGirlGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.defender,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateDefenderGameOptionsDto)
  @ValidateNested()
  public defender: CreateDefenderGameOptionsDto = new CreateDefenderGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.elder,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateElderGameOptionsDto)
  @ValidateNested()
  public elder: CreateElderGameOptionsDto = new CreateElderGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.idiot,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateIdiotGameOptionsDto)
  @ValidateNested()
  public idiot: CreateIdiotGameOptionsDto = new CreateIdiotGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.twoSisters,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateTwoSistersGameOptionsDto)
  @ValidateNested()
  public twoSisters: CreateTwoSistersGameOptionsDto = new CreateTwoSistersGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.threeBrothers,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateThreeBrothersGameOptionsDto)
  @ValidateNested()
  public threeBrothers: CreateThreeBrothersGameOptionsDto = new CreateThreeBrothersGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.fox,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateFoxGameOptionsDto)
  @ValidateNested()
  public fox: CreateFoxGameOptionsDto = new CreateFoxGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.bearTamer,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateBearTamerGameOptionsDto)
  @ValidateNested()
  public bearTamer: CreateBearTamerGameOptionsDto = new CreateBearTamerGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.stutteringJudge,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateStutteringJudgeGameOptionsDto)
  @ValidateNested()
  public stutteringJudge: CreateStutteringJudgeGameOptionsDto = new CreateStutteringJudgeGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.wildChild,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateWildChildGameOptionsDto)
  @ValidateNested()
  public wildChild: CreateWildChildGameOptionsDto = new CreateWildChildGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.wolfHound,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateWolfHoundGameOptionsDto)
  @ValidateNested()
  public wolfHound: CreateWolfHoundGameOptionsDto = new CreateWolfHoundGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.thief,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateThiefGameOptionsDto)
  @ValidateNested()
  public thief: CreateThiefGameOptionsDto = new CreateThiefGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.piedPiper,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreatePiedPiperGameOptionsDto)
  @ValidateNested()
  public piedPiper: CreatePiedPiperGameOptionsDto = new CreatePiedPiperGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.scandalmonger,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateScandalmongerGameOptionsDto)
  @ValidateNested()
  public scandalmonger: CreateScandalmongerGameOptionsDto = new CreateScandalmongerGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.witch,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateWitchGameOptionsDto)
  @ValidateNested()
  public witch: CreateWitchGameOptionsDto = new CreateWitchGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.prejudicedManipulator,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreatePrejudicedManipulatorGameOptionsDto)
  @ValidateNested()
  public prejudicedManipulator: CreatePrejudicedManipulatorGameOptionsDto = new CreatePrejudicedManipulatorGameOptionsDto();

  @ApiProperty({
    ...ROLES_GAME_OPTIONS_API_PROPERTIES.actor,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateActorGameOptionsDto)
  @ValidateNested()
  public actor: CreateActorGameOptionsDto = new CreateActorGameOptionsDto();
}

export { CreateRolesGameOptionsDto };