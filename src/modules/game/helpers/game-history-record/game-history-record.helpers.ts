import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordPlayerAttributeAlterationStatus } from "@/modules/game/types/game-history-record/game-history-record.types";
import type { GameSource } from "@/modules/game/types/game.types";
import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";

// TODO: TO TEST
function doesHavePlayerAttributeAlterationWithNameSourceAndStatus(
  gameHistoryRecord: GameHistoryRecord,
  attributeName: PlayerAttributeName,
  source: GameSource,
  status: GameHistoryRecordPlayerAttributeAlterationStatus,
): boolean {
  return gameHistoryRecord.playerAttributeAlterations?.some(alteration => alteration.name === attributeName &&
    alteration.source === source &&
    alteration.status === status) === true;
}

function doesHavePlayerAttributeAlterationWithNameAndStatus(
  gameHistoryRecord: GameHistoryRecord,
  attributeName: PlayerAttributeName,
  status: GameHistoryRecordPlayerAttributeAlterationStatus,
): boolean {
  return gameHistoryRecord.playerAttributeAlterations?.some(alteration => alteration.name === attributeName && alteration.status === status) === true;
}

export {
  doesHavePlayerAttributeAlterationWithNameSourceAndStatus,
  doesHavePlayerAttributeAlterationWithNameAndStatus,
};