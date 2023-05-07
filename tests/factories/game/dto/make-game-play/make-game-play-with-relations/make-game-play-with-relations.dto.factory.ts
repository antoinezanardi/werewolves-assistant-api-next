import { plainToInstance } from "class-transformer";
import { MakeGamePlayWithRelationsDto } from "../../../../../../src/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";

function createFakeMakeGamePlayWithRelationsDto(makeGamePlayWithRelationsDto: Partial<MakeGamePlayWithRelationsDto> = {}, override: object = {}): MakeGamePlayWithRelationsDto {
  return plainToInstance(MakeGamePlayWithRelationsDto, {
    targets: makeGamePlayWithRelationsDto.targets ?? undefined,
    votes: makeGamePlayWithRelationsDto.votes ?? undefined,
    doesJudgeRequestAnotherVote: makeGamePlayWithRelationsDto.doesJudgeRequestAnotherVote ?? undefined,
    chosenCard: makeGamePlayWithRelationsDto.chosenCard ?? undefined,
    chosenSide: makeGamePlayWithRelationsDto.chosenSide ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeMakeGamePlayWithRelationsDto };