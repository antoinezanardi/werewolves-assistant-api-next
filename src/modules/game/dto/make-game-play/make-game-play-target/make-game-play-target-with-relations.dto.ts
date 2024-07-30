import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { OmitType } from "@nestjs/swagger";
import { Expose, plainToInstance, Type } from "class-transformer";

import { MakeGamePlayTargetDto } from "@/modules/game/dto/make-game-play/make-game-play-target/make-game-play-target.dto";
import { Player } from "@/modules/game/schemas/player/player.schema";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

class MakeGamePlayTargetWithRelationsDto extends OmitType(MakeGamePlayTargetDto, ["playerId"] as const) {
  @Type(() => Player)
  @Expose()
  public player: Player;

  public static create(makeGamePlayTargetWithRelationsDto: MakeGamePlayTargetWithRelationsDto): MakeGamePlayTargetWithRelationsDto {
    return plainToInstance(MakeGamePlayTargetWithRelationsDto, toJSON(makeGamePlayTargetWithRelationsDto), {
      ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS,
      excludeExtraneousValues: true,
    });
  }
}

export { MakeGamePlayTargetWithRelationsDto };