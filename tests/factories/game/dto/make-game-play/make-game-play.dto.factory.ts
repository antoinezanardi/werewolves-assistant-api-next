import { plainToInstance } from "class-transformer";
import { MakeGamePlayDto } from "../../../../../src/modules/game/dto/make-game-play/make-game-play.dto";

function createFakeMakeGamePlayDto(obj: Partial<MakeGamePlayDto> = {}, override: object = {}): MakeGamePlayDto {
  return plainToInstance(MakeGamePlayDto, {
    targets: obj.targets ?? undefined,
    votes: obj.votes ?? undefined,
    doesJudgeRequestAnotherVote: obj.doesJudgeRequestAnotherVote ?? undefined,
    chosenCardId: obj.chosenCardId ?? undefined,
    chosenSide: obj.chosenSide ?? undefined,
    ...override,
  });
}

export { createFakeMakeGamePlayDto };