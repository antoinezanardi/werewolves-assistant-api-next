import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { roles } from "../../../../src/role/constants/role.constant";
import { RoleService } from "../../../../src/role/role.service";

describe("Role Service", () => {
  let service: RoleService;

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({ providers: [RoleService] }).compile();
    service = module.get<RoleService>(RoleService);
  });

  describe("getRoles", () => {
    it("should get all roles when called.", () => {
      expect(service.getRoles()).toStrictEqual(roles);
    });
  });
});