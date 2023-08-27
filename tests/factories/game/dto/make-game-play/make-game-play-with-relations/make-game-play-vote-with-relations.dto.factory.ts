import { plainToInstance } from "class-transformer";

import { MakeGamePlayVoteWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-vote/make-game-play-vote-with-relations.dto";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeMakeGamePlayVoteWithRelationsDto(
  makeGamePlayVoteWithRelationsDto: Partial<MakeGamePlayVoteWithRelationsDto> = {},
  override: object = {},
): MakeGamePlayVoteWithRelationsDto {
  return plainToInstance(MakeGamePlayVoteWithRelationsDto, {
    source: makeGamePlayVoteWithRelationsDto.source ?? createFakePlayer(),
    target: makeGamePlayVoteWithRelationsDto.target ?? createFakePlayer(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeMakeGamePlayVoteWithRelationsDto };