import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { rolesGameOptionsApiProperties, rolesGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/roles-game-options.constant";
import { AncientGameOptions, AncientGameOptionsSchema } from "./ancient-game-options.schema";
import { BearTamerGameOptions, BearTamerGameOptionsSchema } from "./bear-tamer-game-options.schema";
import { BigBadWolfGameOptions, BigBadWolfGameOptionsSchema } from "./big-bad-wolf-game-options.schema";
import { DogWolfGameOptions, DogWolfGameOptionsSchema } from "./dog-wolf-game-options.schema";
import { FoxGameOptions, FoxGameOptionsSchema } from "./fox-game-options.schema";
import { GuardGameOptions, GuardGameOptionsSchema } from "./guard-game-options.schema";
import { IdiotGameOptions, IdiotGameOptionsSchema } from "./idiot-game-options.schema";
import { LittleGirlGameOptions, LittleGirlGameOptionsSchema } from "./little-girl-game-options.schema";
import { PiedPiperGameOptions, PiedPiperGameOptionsSchema } from "./pied-piper-game-options.schema";
import { RavenGameOptions, RavenGameOptionsSchema } from "./raven-game-options.schema";
import { SeerGameOptions, SeerGameOptionsSchema } from "./seer-game-options.schema";
import { SheriffGameOptions, SheriffGameOptionsSchema } from "./sheriff-game-options/sheriff-game-options.schema";
import { StutteringJudgeGameOptions, StutteringJudgeGameOptionsSchema } from "./stuttering-judge-game-options.schema";
import { ThiefGameOptions, ThiefGameOptionsSchema } from "./thief-game-options.schema";
import { ThreeBrothersGameOptions, ThreeBrothersGameOptionsSchema } from "./three-brothers-game-options.schema";
import { TwoSistersGameOptions, TwoSistersGameOptionsSchema } from "./two-sisters-game-options.schema";
import { WhiteWerewolfGameOptions, WhiteWerewolfGameOptionsSchema } from "./white-werewolf-game-options.schema";
import { WildChildGameOptions, WildChildGameOptionsSchema } from "./wild-child-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class RolesGameOptions {
  @ApiProperty(rolesGameOptionsApiProperties.doSkipCallIfNoTarget)
  @Prop({ default: rolesGameOptionsFieldsSpecs.doSkipCallIfNoTarget.default })
  @Expose()
  public doSkipCallIfNoTarget: boolean;

  @ApiProperty(rolesGameOptionsApiProperties.areRevealedOnDeath)
  @Prop({ default: rolesGameOptionsFieldsSpecs.areRevealedOnDeath.default })
  @Expose()
  public areRevealedOnDeath: boolean;

  @ApiProperty(rolesGameOptionsApiProperties.sheriff)
  @Prop({
    type: SheriffGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => SheriffGameOptions)
  @Expose()
  public sheriff: SheriffGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.bigBadWolf)
  @Prop({
    type: BigBadWolfGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => BigBadWolfGameOptions)
  @Expose()
  public bigBadWolf: BigBadWolfGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.whiteWerewolf)
  @Prop({
    type: WhiteWerewolfGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => WhiteWerewolfGameOptions)
  @Expose()
  public whiteWerewolf: WhiteWerewolfGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.seer)
  @Prop({
    type: SeerGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => SeerGameOptions)
  @Expose()
  public seer: SeerGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.littleGirl)
  @Prop({
    type: LittleGirlGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => LittleGirlGameOptions)
  @Expose()
  public littleGirl: LittleGirlGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.guard)
  @Prop({
    type: GuardGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => GuardGameOptions)
  @Expose()
  public guard: GuardGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.ancient)
  @Prop({
    type: AncientGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => AncientGameOptions)
  @Expose()
  public ancient: AncientGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.idiot)
  @Prop({
    type: IdiotGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => IdiotGameOptions)
  @Expose()
  public idiot: IdiotGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.twoSisters)
  @Prop({
    type: TwoSistersGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => TwoSistersGameOptions)
  @Expose()
  public twoSisters: TwoSistersGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.threeBrothers)
  @Prop({
    type: ThreeBrothersGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => ThreeBrothersGameOptions)
  @Expose()
  public threeBrothers: ThreeBrothersGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.fox)
  @Prop({
    type: FoxGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => FoxGameOptions)
  @Expose()
  public fox: FoxGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.bearTamer)
  @Prop({
    type: BearTamerGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => BearTamerGameOptions)
  @Expose()
  public bearTamer: BearTamerGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.stutteringJudge)
  @Prop({
    type: StutteringJudgeGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => StutteringJudgeGameOptions)
  @Expose()
  public stutteringJudge: StutteringJudgeGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.wildChild)
  @Prop({
    type: WildChildGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => WildChildGameOptions)
  @Expose()
  public wildChild: WildChildGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.dogWolf)
  @Prop({
    type: DogWolfGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => DogWolfGameOptions)
  @Expose()
  public dogWolf: DogWolfGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.thief)
  @Prop({
    type: ThiefGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => ThiefGameOptions)
  @Expose()
  public thief: ThiefGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.piedPiper)
  @Prop({
    type: PiedPiperGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => PiedPiperGameOptions)
  @Expose()
  public piedPiper: PiedPiperGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.raven)
  @Prop({
    type: RavenGameOptionsSchema,
    default: () => ({}),
  })
  @Type(() => RavenGameOptions)
  @Expose()
  public raven: RavenGameOptions;
}

const RolesGameOptionsSchema = SchemaFactory.createForClass(RolesGameOptions);

export { RolesGameOptions, RolesGameOptionsSchema };