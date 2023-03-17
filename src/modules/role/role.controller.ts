import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_RESOURCES } from "../../shared/api/enums/api.enum";
import { roles } from "./constants/role.constant";
import { Role } from "./role.entity";

@ApiTags("🃏 Roles")
@Controller(API_RESOURCES.ROLES)
export class RoleController {
  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: Role, isArray: true })
  public getRoles(): readonly Role[] {
    return roles;
  }
}