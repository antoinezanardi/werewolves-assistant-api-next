import type { ApiPropertyOptions } from "@nestjs/swagger";

import { WitchPotions } from "@/modules/game/enums/game-play.enum";
import type { GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema";

const GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS = Object.freeze<Record<keyof GameHistoryRecordPlayTarget, ApiPropertyOptions>>({
  player: { required: true },
  isInfected: { required: false },
  drankPotion: {
    enum: WitchPotions,
    required: false,
  },
});

const GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES = Object.freeze<Record<keyof GameHistoryRecordPlayTarget, ApiPropertyOptions>>({
  player: {
    description: "Targeted player of this play",
    ...GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.player,
  },
  isInfected: {
    description: "Only if there is the `vile father of wolves` in the game and the action is eat from werewolves. If set to `true`, the target joined the werewolves side",
    ...GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.isInfected,
  },
  drankPotion: {
    description: "Only if there is the `witch` in the game. The consequences depends on the type of potion",
    ...GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.drankPotion,
  },
});

export {
  GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES,
};