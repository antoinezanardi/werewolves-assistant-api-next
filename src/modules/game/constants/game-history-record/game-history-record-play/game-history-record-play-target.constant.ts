
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { WITCH_POTIONS } from "@/modules/game/enums/game-play.enum";
import type { GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target.schema";

const gameHistoryRecordPlayTargetFieldsSpecs = Object.freeze<Record<keyof GameHistoryRecordPlayTarget, ApiPropertyOptions>>({
  player: { required: true },
  isInfected: { required: false },
  drankPotion: {
    enum: WITCH_POTIONS,
    required: false,
  },
});

const gameHistoryRecordPlayTargetApiProperties = Object.freeze<Record<keyof GameHistoryRecordPlayTarget, ApiPropertyOptions>>({
  player: {
    description: "Targeted player of this play",
    ...gameHistoryRecordPlayTargetFieldsSpecs.player,
  },
  isInfected: {
    description: "Only if there is the `vile father of wolves` in the game and the action is eat from werewolves. If set to `true`, the target joined the werewolves side",
    ...gameHistoryRecordPlayTargetFieldsSpecs.isInfected,
  },
  drankPotion: {
    description: "Only if there is the `witch` in the game. The consequences depends on the type of potion",
    ...gameHistoryRecordPlayTargetFieldsSpecs.drankPotion,
  },
});

export { gameHistoryRecordPlayTargetFieldsSpecs, gameHistoryRecordPlayTargetApiProperties };