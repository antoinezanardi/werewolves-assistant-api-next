import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { CupidGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-game-options.schema";
import { WitchGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/witch-game-options/witch-game-options.schema";
import { ROLES_GAME_OPTIONS_API_PROPERTIES, ROLES_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema.constant";
import { ElderGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/elder-game-options/elder-game-options.schema";
import { BearTamerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema";
import { BigBadWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options/big-bad-wolf-game-options.schema";
import { WolfHoundGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wolf-hound-game-options/wolf-hound-game-options.schema";
import { FoxGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options/fox-game-options.schema";
import { DefenderGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/defender-game-options/defender-game-options.schema";
import { IdiotGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema";
import { LittleGirlGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options/little-girl-game-options.schema";
import { PiedPiperGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options/pied-piper-game-options.schema";
import { ScandalmongerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/scandalmonger-game-options/scandalmonger-game-options.schema";
import { SeerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options/seer-game-options.schema";
import { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import { StutteringJudgeGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options/stuttering-judge-game-options.schema";
import { ThiefGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema";
import { ThreeBrothersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options/three-brothers-game-options.schema";
import { TwoSistersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options/two-sisters-game-options.schema";
import { WhiteWerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options/white-werewolf-game-options.schema";
import { WildChildGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options/wild-child-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class RolesGameOptions {
  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.doSkipCallIfNoTarget as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.doSkipCallIfNoTarget)
  @Expose()
  public doSkipCallIfNoTarget: boolean;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.areRevealedOnDeath as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.areRevealedOnDeath)
  @Expose()
  public areRevealedOnDeath: boolean;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.sheriff as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.sheriff)
  @Type(() => SheriffGameOptions)
  @Expose()
  public sheriff: SheriffGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.bigBadWolf as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.bigBadWolf)
  @Type(() => BigBadWolfGameOptions)
  @Expose()
  public bigBadWolf: BigBadWolfGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.whiteWerewolf as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.whiteWerewolf)
  @Type(() => WhiteWerewolfGameOptions)
  @Expose()
  public whiteWerewolf: WhiteWerewolfGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.seer as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.seer)
  @Type(() => SeerGameOptions)
  @Expose()
  public seer: SeerGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.cupid as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.cupid)
  @Type(() => CupidGameOptions)
  @Expose()
  public cupid: CupidGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.littleGirl as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.littleGirl)
  @Type(() => LittleGirlGameOptions)
  @Expose()
  public littleGirl: LittleGirlGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.defender as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.defender)
  @Type(() => DefenderGameOptions)
  @Expose()
  public defender: DefenderGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.elder as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.elder)
  @Type(() => ElderGameOptions)
  @Expose()
  public elder: ElderGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.idiot as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.idiot)
  @Type(() => IdiotGameOptions)
  @Expose()
  public idiot: IdiotGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.twoSisters as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.twoSisters)
  @Type(() => TwoSistersGameOptions)
  @Expose()
  public twoSisters: TwoSistersGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.threeBrothers as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.threeBrothers)
  @Type(() => ThreeBrothersGameOptions)
  @Expose()
  public threeBrothers: ThreeBrothersGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.fox as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.fox)
  @Type(() => FoxGameOptions)
  @Expose()
  public fox: FoxGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.bearTamer as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.bearTamer)
  @Type(() => BearTamerGameOptions)
  @Expose()
  public bearTamer: BearTamerGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.stutteringJudge as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.stutteringJudge)
  @Type(() => StutteringJudgeGameOptions)
  @Expose()
  public stutteringJudge: StutteringJudgeGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.wildChild as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.wildChild)
  @Type(() => WildChildGameOptions)
  @Expose()
  public wildChild: WildChildGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.wolfHound as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.wolfHound)
  @Type(() => WolfHoundGameOptions)
  @Expose()
  public wolfHound: WolfHoundGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.thief as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.thief)
  @Type(() => ThiefGameOptions)
  @Expose()
  public thief: ThiefGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.piedPiper as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.piedPiper)
  @Type(() => PiedPiperGameOptions)
  @Expose()
  public piedPiper: PiedPiperGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.scandalmonger as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.scandalmonger)
  @Type(() => ScandalmongerGameOptions)
  @Expose()
  public scandalmonger: ScandalmongerGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.witch as ApiPropertyOptions)
  @Prop(ROLES_GAME_OPTIONS_FIELDS_SPECS.witch)
  @Type(() => WitchGameOptions)
  public witch: WitchGameOptions;
}

const ROLES_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(RolesGameOptions);

export {
  RolesGameOptions,
  ROLES_GAME_OPTIONS_SCHEMA,
};