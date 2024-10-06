import { CreateGameFeedbackDto } from "@/modules/game/dto/create-game-feedback/create-game-feedback.dto";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

function createFakeCreateGameFeedbackDto(createGameFeedbackDto: Partial<CreateGameFeedbackDto> = {}, override: object = {}): CreateGameFeedbackDto {
  return plainToInstance(CreateGameFeedbackDto, {
    score: createGameFeedbackDto.score ?? faker.number.int({ min: 1, max: 5 }),
    review: createGameFeedbackDto.review ?? faker.lorem.text(),
    hasEncounteredError: createGameFeedbackDto.hasEncounteredError ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeCreateGameFeedbackDto };