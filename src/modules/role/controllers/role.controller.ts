import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ROLES } from "@/modules/role/constants/role.constant";
import { Role } from "@/modules/role/types/role.type";

import { ApiResources } from "@/shared/api/enums/api.enum";

@ApiTags("🃏 Roles")
@Controller(ApiResources.ROLES)
export class RoleController {
  @Get()
  @ApiOperation({ summary: "Get all available roles for games" })
  @ApiResponse({ status: HttpStatus.OK, type: Role, isArray: true })
  private getRoles(): readonly Role[] {
    return ROLES;
  }
}