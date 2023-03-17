import { Injectable } from "@nestjs/common";
import { roles } from "./constants/role.constant";
import type { Role } from "./role.entity";

@Injectable()
export class RoleService {
  public getRoles(): readonly Role[] {
    void this;
    return roles;
  }
}