import { Module } from "@nestjs/common";

import { RoleController } from "@/modules/role/controllers/role.controller";

@Module({ controllers: [RoleController] })
export class RoleModule {}