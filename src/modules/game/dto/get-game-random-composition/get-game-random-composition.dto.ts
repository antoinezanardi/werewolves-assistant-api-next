import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayNotContains, ArrayUnique, IsArray, IsBoolean, IsOptional, ValidateNested } from "class-validator";

import { RoleName } from "@/modules/role/types/role.types";
import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { CompositionBounds } from "@/modules/game/dto/base/decorators/composition/composition-bounds.decorator";
import { CompositionUniqueNames } from "@/modules/game/dto/base/decorators/composition/composition-unique-names.decorator";
import { GetGameRandomCompositionPlayerDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition-player/get-game-random-composition-player.dto";

import { toBoolean } from "@/shared/validation/transformers/validation.transformer";

class GetGameRandomCompositionDto {
  @ApiProperty({ description: "Game's players to get the random composition from" })
  @Type(() => GetGameRandomCompositionPlayerDto)
  @ValidateNested({ each: true })
  @IsArray()
  @CompositionUniqueNames()
  @CompositionBounds()
  public players: GetGameRandomCompositionPlayerDto[];

  @ApiProperty({
    name: "excluded-roles",
    description: "Roles that won't be given by game random composition. All roles can be excluded except `villager` and `werewolf`",
    enum: ROLE_NAMES,
    required: false,
  })
  @Expose({ name: "excluded-roles" })
  @IsOptional()
  @IsArray()
  @ArrayNotContains(["villager", "werewolf"])
  @ArrayUnique((role: RoleName) => role, { message: "excluded roles must be unique" })
  public excludedRoles: RoleName[] = [];

  @ApiProperty({
    name: "are-recommended-min-players-respected",
    description: "If set to `true`, game composition will make sure that roles distributed respect the recommend min players in the game",
    required: false,
  })
  @Expose({ name: "are-recommended-min-players-respected" })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  public areRecommendedMinPlayersRespected: boolean = true;

  @ApiProperty({
    name: "are-powerful-villagers-roles-prioritized",
    description: "If set to `true`, villager roles with powers will be given to players before simple villager roles",
    required: false,
  })
  @Expose({ name: "are-powerful-villagers-roles-prioritized" })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  public arePowerfulVillagerRolesPrioritized: boolean = true;

  @ApiProperty({
    name: "are-powerful-werewolves-roles-prioritized",
    description: "If set to `true`, werewolf roles with powers will be given to players before simple werewolf roles",
    required: false,
  })
  @Expose({ name: "are-powerful-werewolves-roles-prioritized" })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  public arePowerfulWerewolfRolesPrioritized: boolean = false;
}

export { GetGameRandomCompositionDto };