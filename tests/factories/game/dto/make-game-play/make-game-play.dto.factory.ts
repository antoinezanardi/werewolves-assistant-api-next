import { plainToInstance } from "class-transformer";
import { MakeGamePlayDto } from "../../../../../src/modules/game/dto/make-game-play/make-game-play.dto";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";

function createFakeMakeGamePlayDto(makeGamePlayDto: Partial<MakeGamePlayDto> = {}, override: object = {}): MakeGamePlayDto {
  return plainToInstance(MakeGamePlayDto, {
    targets: makeGamePlayDto.targets ?? undefined,
    votes: makeGamePlayDto.votes ?? undefined,
    doesJudgeRequestAnotherVote: makeGamePlayDto.doesJudgeRequestAnotherVote ?? undefined,
    chosenCardId: makeGamePlayDto.chosenCardId ?? undefined,
    chosenSide: makeGamePlayDto.chosenSide ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeMakeGamePlayDto };