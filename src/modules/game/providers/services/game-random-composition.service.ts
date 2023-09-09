import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { sample, shuffle } from "lodash";

import { GetGameRandomCompositionPlayerResponseDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition-player-response/get-game-random-composition-player-response.dto";
import type { GetGameRandomCompositionDto } from "@/modules/game/dto/get-game-random-composition/get-game-random-composition.dto";
import { DEFAULT_VILLAGER_ROLE, DEFAULT_WEREWOLF_ROLE, ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";
import { getRolesWithSide } from "@/modules/role/helpers/role.helper";
import { Role } from "@/modules/role/types/role.type";

@Injectable()
export class GameRandomCompositionService {
  public getGameRandomComposition(getGameRandomCompositionDto: GetGameRandomCompositionDto): GetGameRandomCompositionPlayerResponseDto[] {
    const availableRoles = plainToInstance(Role, this.getAvailableRolesForGameRandomComposition(getGameRandomCompositionDto));
    const werewolfRolesCount = this.getWerewolfCountForComposition(getGameRandomCompositionDto.players.length);
    const villagerRolesCount = getGameRandomCompositionDto.players.length - werewolfRolesCount;
    const randomRoles = [
      ...this.getRandomRolesForSide(availableRoles, werewolfRolesCount, RoleSides.WEREWOLVES),
      ...this.getRandomRolesForSide(availableRoles, villagerRolesCount, RoleSides.VILLAGERS),
    ];
    const shuffledRandomRoles = shuffle(randomRoles);
    return getGameRandomCompositionDto.players.map<GetGameRandomCompositionPlayerResponseDto>((player, index) => plainToInstance(GetGameRandomCompositionPlayerResponseDto, {
      name: player.name,
      role: { name: shuffledRandomRoles[index].name },
      side: {},
    }));
  }

  private getRandomRolesForSide(availableRoles: Role[], rolesToPickCount: number, side: RoleSides): Role[] {
    const randomRoles: Role[] = [];
    const availableSidedRoles = getRolesWithSide(availableRoles, side);
    const defaultSidedRole = side === RoleSides.VILLAGERS ? DEFAULT_VILLAGER_ROLE : DEFAULT_WEREWOLF_ROLE;
    let randomRolesToPickCount = 1;
    for (let i = 0; i < rolesToPickCount; i += randomRolesToPickCount) {
      const leftRolesToPickCount = rolesToPickCount - i;
      const leftRolesToPick = availableSidedRoles.filter(role => role.maxInGame && (role.minInGame === undefined || role.minInGame <= leftRolesToPickCount));
      const randomRole = sample(leftRolesToPick);
      if (randomRole === undefined) {
        randomRolesToPickCount = 1;
        randomRoles.push(defaultSidedRole);
      } else {
        randomRolesToPickCount = randomRole.minInGame ?? 1;
        for (let j = 0; j < randomRolesToPickCount; j++) {
          randomRole.maxInGame--;
          randomRoles.push(randomRole);
        }
      }
    }
    return randomRoles;
  }

  private getWerewolfCountForComposition(playerCount: number): number {
    const werewolvesRatio = 6;
    return Math.ceil(playerCount / werewolvesRatio);
  }

  private getAvailableRolesForGameRandomComposition(getGameRandomCompositionDto: GetGameRandomCompositionDto): Role[] {
    const {
      players,
      excludedRoles,
      areRecommendedMinPlayersRespected,
      arePowerfulVillagerRolesPrioritized,
      arePowerfulWerewolfRolesPrioritized,
    } = getGameRandomCompositionDto;
    return ROLES.filter(role => {
      if (role.name === RoleNames.VILLAGER) {
        return !arePowerfulVillagerRolesPrioritized;
      } else if (role.name === RoleNames.WEREWOLF) {
        return !arePowerfulWerewolfRolesPrioritized;
      }
      const isRolePermitted = !excludedRoles.includes(role.name);
      const isRoleMinInGameRespected = !areRecommendedMinPlayersRespected || role.recommendedMinPlayers === undefined || role.recommendedMinPlayers <= players.length;
      return isRolePermitted && isRoleMinInGameRespected;
    });
  }
}