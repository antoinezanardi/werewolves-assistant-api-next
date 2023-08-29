import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { ROLES_GAME_OPTIONS_API_PROPERTIES, ROLES_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/roles-game-options.constant";
import { AncientGameOptions, ANCIENT_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/ancient-game-options.schema";
import { BearTamerGameOptions, BEAR_TAMER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options.schema";
import { BigBadWolfGameOptions, BIG_BAD_WOLF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options.schema";
import { DogWolfGameOptions, DOG_WOLF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options.schema";
import { FoxGameOptions, FOX_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options.schema";
import { GuardGameOptions, GUARD_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/guard-game-options.schema";
import { IdiotGameOptions, IDIOT_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options.schema";
import { LittleGirlGameOptions, LITTLE_GIRL_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options.schema";
import { PiedPiperGameOptions, PIED_PIPER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options.schema";
import { RavenGameOptions, RAVEN_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/raven-game-options.schema";
import { SeerGameOptions, SEER_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options.schema";
import { SheriffGameOptions, SHERIFF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import { StutteringJudgeGameOptions, STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options.schema";
import { ThiefGameOptions, THIEF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options.schema";
import { ThreeBrothersGameOptions, THREE_BROTHERS_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options.schema";
import { TwoSistersGameOptions, TWO_SISTERS_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options.schema";
import { WhiteWerewolfGameOptions, WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options.schema";
import { WildChildGameOptions, WILD_CHILD_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class RolesGameOptions {
  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.doSkipCallIfNoTarget)
  @Prop({ default: ROLES_GAME_OPTIONS_FIELDS_SPECS.doSkipCallIfNoTarget.default })
  @Expose()
  public doSkipCallIfNoTarget: boolean;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.areRevealedOnDeath)
  @Prop({ default: ROLES_GAME_OPTIONS_FIELDS_SPECS.areRevealedOnDeath.default })
  @Expose()
  public areRevealedOnDeath: boolean;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.sheriff)
  @Prop({
    type: SHERIFF_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => SheriffGameOptions)
  @Expose()
  public sheriff: SheriffGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.bigBadWolf)
  @Prop({
    type: BIG_BAD_WOLF_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => BigBadWolfGameOptions)
  @Expose()
  public bigBadWolf: BigBadWolfGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.whiteWerewolf)
  @Prop({
    type: WHITE_WEREWOLF_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => WhiteWerewolfGameOptions)
  @Expose()
  public whiteWerewolf: WhiteWerewolfGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.seer)
  @Prop({
    type: SEER_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => SeerGameOptions)
  @Expose()
  public seer: SeerGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.littleGirl)
  @Prop({
    type: LITTLE_GIRL_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => LittleGirlGameOptions)
  @Expose()
  public littleGirl: LittleGirlGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.guard)
  @Prop({
    type: GUARD_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => GuardGameOptions)
  @Expose()
  public guard: GuardGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.ancient)
  @Prop({
    type: ANCIENT_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => AncientGameOptions)
  @Expose()
  public ancient: AncientGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.idiot)
  @Prop({
    type: IDIOT_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => IdiotGameOptions)
  @Expose()
  public idiot: IdiotGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.twoSisters)
  @Prop({
    type: TWO_SISTERS_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => TwoSistersGameOptions)
  @Expose()
  public twoSisters: TwoSistersGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.threeBrothers)
  @Prop({
    type: THREE_BROTHERS_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => ThreeBrothersGameOptions)
  @Expose()
  public threeBrothers: ThreeBrothersGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.fox)
  @Prop({
    type: FOX_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => FoxGameOptions)
  @Expose()
  public fox: FoxGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.bearTamer)
  @Prop({
    type: BEAR_TAMER_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => BearTamerGameOptions)
  @Expose()
  public bearTamer: BearTamerGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.stutteringJudge)
  @Prop({
    type: STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => StutteringJudgeGameOptions)
  @Expose()
  public stutteringJudge: StutteringJudgeGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.wildChild)
  @Prop({
    type: WILD_CHILD_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => WildChildGameOptions)
  @Expose()
  public wildChild: WildChildGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.dogWolf)
  @Prop({
    type: DOG_WOLF_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => DogWolfGameOptions)
  @Expose()
  public dogWolf: DogWolfGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.thief)
  @Prop({
    type: THIEF_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => ThiefGameOptions)
  @Expose()
  public thief: ThiefGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.piedPiper)
  @Prop({
    type: PIED_PIPER_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => PiedPiperGameOptions)
  @Expose()
  public piedPiper: PiedPiperGameOptions;

  @ApiProperty(ROLES_GAME_OPTIONS_API_PROPERTIES.raven)
  @Prop({
    type: RAVEN_GAME_OPTIONS_SCHEMA,
    default: () => ({}),
  })
  @Type(() => RavenGameOptions)
  @Expose()
  public raven: RavenGameOptions;
}

const ROLES_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(RolesGameOptions);

export {
  RolesGameOptions,
  ROLES_GAME_OPTIONS_SCHEMA,
};