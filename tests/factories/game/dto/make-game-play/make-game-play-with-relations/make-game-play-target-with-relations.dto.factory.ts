import { plainToInstance } from "class-transformer";

import { MakeGamePlayTargetWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeMakeGamePlayTargetWithRelationsDto(
  makeGamePlayTargetWithRelationsDto: Partial<MakeGamePlayTargetWithRelationsDto> = {},
  override: object = {},
): MakeGamePlayTargetWithRelationsDto {
  return plainToInstance(MakeGamePlayTargetWithRelationsDto, {
    player: makeGamePlayTargetWithRelationsDto.player ?? createFakePlayer(),
    isInfected: makeGamePlayTargetWithRelationsDto.isInfected ?? undefined,
    drankPotion: makeGamePlayTargetWithRelationsDto.drankPotion ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeMakeGamePlayTargetWithRelationsDto };