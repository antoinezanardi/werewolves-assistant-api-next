import { plainToInstance } from "class-transformer";

import { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeMakeGamePlayDto(makeGamePlayDto: Partial<MakeGamePlayDto> = {}, override: object = {}): MakeGamePlayDto {
  return plainToInstance(MakeGamePlayDto, {
    targets: makeGamePlayDto.targets ?? undefined,
    votes: makeGamePlayDto.votes ?? undefined,
    doesJudgeRequestAnotherVote: makeGamePlayDto.doesJudgeRequestAnotherVote ?? undefined,
    chosenCardId: makeGamePlayDto.chosenCardId ?? undefined,
    chosenSide: makeGamePlayDto.chosenSide ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeMakeGamePlayDto };