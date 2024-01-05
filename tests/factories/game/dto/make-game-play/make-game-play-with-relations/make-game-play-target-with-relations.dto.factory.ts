import { plainToInstance } from "class-transformer";

import { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeMakeGamePlayTargetWithRelationsDto(
  makeGamePlayTargetWithRelationsDto: Partial<MakeGamePlayTargetWithRelationsDto> = {},
  override: object = {},
): MakeGamePlayTargetWithRelationsDto {
  return plainToInstance(MakeGamePlayTargetWithRelationsDto, {
    player: makeGamePlayTargetWithRelationsDto.player ?? createFakePlayer(),
    drankPotion: makeGamePlayTargetWithRelationsDto.drankPotion ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeMakeGamePlayTargetWithRelationsDto };