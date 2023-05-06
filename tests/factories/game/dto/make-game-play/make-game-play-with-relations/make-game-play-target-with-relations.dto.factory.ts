import { plainToInstance } from "class-transformer";
import { MakeGamePlayTargetWithRelationsDto } from "../../../../../../src/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target-with-relations.dto";
import { plainToInstanceDefaultOptions } from "../../../../../../src/shared/validation/constants/validation.constant";
import { createFakePlayer } from "../../../schemas/player/player.schema.factory";

function createFakeMakeGamePlayTargetWithRelationsDto(
  makeGamePlayTargetWithRelationsDto: Partial<MakeGamePlayTargetWithRelationsDto> = {},
  override: object = {},
): MakeGamePlayTargetWithRelationsDto {
  return plainToInstance(MakeGamePlayTargetWithRelationsDto, {
    player: makeGamePlayTargetWithRelationsDto.player ?? createFakePlayer(),
    isInfected: makeGamePlayTargetWithRelationsDto.isInfected ?? undefined,
    drankPotion: makeGamePlayTargetWithRelationsDto.drankPotion ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeMakeGamePlayTargetWithRelationsDto };