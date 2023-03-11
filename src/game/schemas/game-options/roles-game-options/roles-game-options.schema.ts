import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";
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
  @ApiProperty({
    description: "If set to `true`, player's role is revealed when he's dead",
    default: defaultGameOptions.roles.areRevealedOnDeath,
  })
  @Prop({ default: defaultGameOptions.roles.areRevealedOnDeath })
  public areRevealedOnDeath: boolean;

  @ApiProperty({ description: "Game `sheriff` role's options." })
  @Prop({
    type: SheriffGameOptionsSchema,
    default: () => ({}),
  })
  public sheriff: SheriffGameOptions;

  @ApiProperty({ description: "Game `big bad wolf` role's options." })
  @Prop({
    type: BigBadWolfGameOptionsSchema,
    default: () => ({}),
  })
  public bigBadWolf: BigBadWolfGameOptions;

  @ApiProperty({ description: "Game `white werewolf` role's options." })
  @Prop({
    type: WhiteWerewolfGameOptionsSchema,
    default: () => ({}),
  })
  public whiteWerewolf: WhiteWerewolfGameOptions;

  @ApiProperty({ description: "Game `seer` role's options." })
  @Prop({
    type: SeerGameOptionsSchema,
    default: () => ({}),
  })
  public seer: SeerGameOptions;

  @ApiProperty({ description: "Game `little girl` role's options." })
  @Prop({
    type: LittleGirlGameOptionsSchema,
    default: () => ({}),
  })
  public littleGirl: LittleGirlGameOptions;

  @ApiProperty({ description: "Game `guard` role's options." })
  @Prop({
    type: GuardGameOptionsSchema,
    default: () => ({}),
  })
  public guard: GuardGameOptions;

  @ApiProperty({ description: "Game `ancient` role's options." })
  @Prop({
    type: AncientGameOptionsSchema,
    default: () => ({}),
  })
  public ancient: AncientGameOptions;

  @ApiProperty({ description: "Game `idiot` role's options." })
  @Prop({
    type: IdiotGameOptionsSchema,
    default: () => ({}),
  })
  public idiot: IdiotGameOptions;

  @ApiProperty({ description: "Game `two sisters` role's options." })
  @Prop({
    type: TwoSistersGameOptionsSchema,
    default: () => ({}),
  })
  public twoSisters: TwoSistersGameOptions;

  @ApiProperty({ description: "Game `three brothers` role's options." })
  @Prop({
    type: ThreeBrothersGameOptionsSchema,
    default: () => ({}),
  })
  public threeBrothers: ThreeBrothersGameOptions;

  @ApiProperty({ description: "Game `fox` role's options." })
  @Prop({
    type: FoxGameOptionsSchema,
    default: () => ({}),
  })
  public fox: FoxGameOptions;

  @ApiProperty({ description: "Game `bear tamer` role's options." })
  @Prop({
    type: BearTamerGameOptionsSchema,
    default: () => ({}),
  })
  public bearTamer: BearTamerGameOptions;

  @ApiProperty({ description: "Game `stuttering judge` role's options." })
  @Prop({
    type: StutteringJudgeGameOptionsSchema,
    default: () => ({}),
  })
  public stutteringJudge: StutteringJudgeGameOptions;

  @ApiProperty({ description: "Game `wild child` role's options." })
  @Prop({
    type: WildChildGameOptionsSchema,
    default: () => ({}),
  })
  public wildChild: WildChildGameOptions;

  @ApiProperty({ description: "Game `dog wolf` role's options." })
  @Prop({
    type: DogWolfGameOptionsSchema,
    default: () => ({}),
  })
  public dogWolf: DogWolfGameOptions;

  @ApiProperty({ description: "Game `thief` role's options." })
  @Prop({
    type: ThiefGameOptionsSchema,
    default: () => ({}),
  })
  public thief: ThiefGameOptions;

  @ApiProperty({ description: "Game `pied piper` role's options." })
  @Prop({
    type: PiedPiperGameOptionsSchema,
    default: () => ({}),
  })
  public piedPiper: PiedPiperGameOptions;

  @ApiProperty({ description: "Game `raven` role's options." })
  @Prop({
    type: RavenGameOptionsSchema,
    default: () => ({}),
  })
  public raven: RavenGameOptions;
}

const RolesGameOptionsSchema = SchemaFactory.createForClass(RolesGameOptions);

export { RolesGameOptions, RolesGameOptionsSchema };