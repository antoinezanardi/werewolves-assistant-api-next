import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_RESOURCES } from "../../../shared/api/enums/api.enum";
import { roles } from "../constants/role.constant";
import { Role } from "../types/role.type";

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