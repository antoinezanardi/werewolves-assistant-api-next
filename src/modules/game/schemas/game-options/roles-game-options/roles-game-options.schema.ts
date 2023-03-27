import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty(rolesGameOptionsApiProperties.areRevealedOnDeath)
  @Prop({ default: rolesGameOptionsFieldsSpecs.areRevealedOnDeath.default })
  public areRevealedOnDeath: boolean;

  @ApiProperty(rolesGameOptionsApiProperties.sheriff)
  @Prop({
    type: SheriffGameOptionsSchema,
    default: () => ({}),
  })
  public sheriff: SheriffGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.bigBadWolf)
  @Prop({
    type: BigBadWolfGameOptionsSchema,
    default: () => ({}),
  })
  public bigBadWolf: BigBadWolfGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.whiteWerewolf)
  @Prop({
    type: WhiteWerewolfGameOptionsSchema,
    default: () => ({}),
  })
  public whiteWerewolf: WhiteWerewolfGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.seer)
  @Prop({
    type: SeerGameOptionsSchema,
    default: () => ({}),
  })
  public seer: SeerGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.littleGirl)
  @Prop({
    type: LittleGirlGameOptionsSchema,
    default: () => ({}),
  })
  public littleGirl: LittleGirlGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.guard)
  @Prop({
    type: GuardGameOptionsSchema,
    default: () => ({}),
  })
  public guard: GuardGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.ancient)
  @Prop({
    type: AncientGameOptionsSchema,
    default: () => ({}),
  })
  public ancient: AncientGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.idiot)
  @Prop({
    type: IdiotGameOptionsSchema,
    default: () => ({}),
  })
  public idiot: IdiotGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.twoSisters)
  @Prop({
    type: TwoSistersGameOptionsSchema,
    default: () => ({}),
  })
  public twoSisters: TwoSistersGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.threeBrothers)
  @Prop({
    type: ThreeBrothersGameOptionsSchema,
    default: () => ({}),
  })
  public threeBrothers: ThreeBrothersGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.fox)
  @Prop({
    type: FoxGameOptionsSchema,
    default: () => ({}),
  })
  public fox: FoxGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.bearTamer)
  @Prop({
    type: BearTamerGameOptionsSchema,
    default: () => ({}),
  })
  public bearTamer: BearTamerGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.stutteringJudge)
  @Prop({
    type: StutteringJudgeGameOptionsSchema,
    default: () => ({}),
  })
  public stutteringJudge: StutteringJudgeGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.wildChild)
  @Prop({
    type: WildChildGameOptionsSchema,
    default: () => ({}),
  })
  public wildChild: WildChildGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.dogWolf)
  @Prop({
    type: DogWolfGameOptionsSchema,
    default: () => ({}),
  })
  public dogWolf: DogWolfGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.thief)
  @Prop({
    type: ThiefGameOptionsSchema,
    default: () => ({}),
  })
  public thief: ThiefGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.piedPiper)
  @Prop({
    type: PiedPiperGameOptionsSchema,
    default: () => ({}),
  })
  public piedPiper: PiedPiperGameOptions;

  @ApiProperty(rolesGameOptionsApiProperties.raven)
  @Prop({
    type: RavenGameOptionsSchema,
    default: () => ({}),
  })
  public raven: RavenGameOptions;
}

const RolesGameOptionsSchema = SchemaFactory.createForClass(RolesGameOptions);

export { RolesGameOptions, RolesGameOptionsSchema };