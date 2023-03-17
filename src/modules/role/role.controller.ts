import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./role.entity";
import { RoleService } from "./role.service";

@ApiTags("🃏 Roles")
@Controller("roles")
export class RoleController {
  public constructor(private readonly roleService: RoleService) {}
  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: Role, isArray: true })
  public getRoles(): readonly Role[] {
    return this.roleService.getRoles();
  }
}