import { plainToInstance } from "class-transformer";

import { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeMakeGamePlayVoteWithRelationsDto(
  makeGamePlayVoteWithRelationsDto: Partial<MakeGamePlayVoteWithRelationsDto> = {},
  override: object = {},
): MakeGamePlayVoteWithRelationsDto {
  return plainToInstance(MakeGamePlayVoteWithRelationsDto, {
    source: makeGamePlayVoteWithRelationsDto.source ?? createFakePlayer(),
    target: makeGamePlayVoteWithRelationsDto.target ?? createFakePlayer(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeMakeGamePlayVoteWithRelationsDto };