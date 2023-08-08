import type { MakeGamePlayVoteDto } from "../../../../../src/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote.dto";
import { getPlayerWithNameOrThrow } from "../../../../../src/modules/game/helpers/game.helper";
import type { Game } from "../../../../../src/modules/game/schemas/game.schema";

function convertDatatableToMakeGameplayVotes(datatable: string[][], game: Game): MakeGamePlayVoteDto[] {
  return datatable.map(([voterName, targetName]) => {
    const voter = getPlayerWithNameOrThrow(voterName, game, new Error(`Player with name ${voterName} not found`));
    const target = getPlayerWithNameOrThrow(targetName, game, new Error(`Player with name ${targetName} not found`));
    return { sourceId: voter._id, targetId: target._id } as MakeGamePlayVoteDto;
  });
}

export { convertDatatableToMakeGameplayVotes };