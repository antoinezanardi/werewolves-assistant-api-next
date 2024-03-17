import { plainToInstance } from "class-transformer";

import { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeMakeGamePlayWithRelationsDto(makeGamePlayWithRelationsDto: Partial<MakeGamePlayWithRelationsDto> = {}, override: object = {}): MakeGamePlayWithRelationsDto {
  return plainToInstance(MakeGamePlayWithRelationsDto, {
    targets: makeGamePlayWithRelationsDto.targets ?? undefined,
    votes: makeGamePlayWithRelationsDto.votes ?? undefined,
    doesJudgeRequestAnotherVote: makeGamePlayWithRelationsDto.doesJudgeRequestAnotherVote ?? undefined,
    chosenCard: makeGamePlayWithRelationsDto.chosenCard ?? undefined,
    chosenSide: makeGamePlayWithRelationsDto.chosenSide ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeMakeGamePlayWithRelationsDto };