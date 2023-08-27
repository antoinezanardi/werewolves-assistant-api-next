import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { roles } from "@/modules/role/constants/role.constant";
import { Role } from "@/modules/role/types/role.type";

import { API_RESOURCES } from "@/shared/api/enums/api.enum";

@ApiTags("🃏 Roles")
@Controller(API_RESOURCES.ROLES)
export class RoleController {
  @Get()
  @ApiOperation({ summary: "Get all available roles for games" })
  @ApiResponse({ status: HttpStatus.OK, type: Role, isArray: true })
  private getRoles(): readonly Role[] {
    return roles;
  }
}