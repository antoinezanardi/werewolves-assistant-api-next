import type { TupleToUnion } from "type-fest";

import type { ROLE_NAMES, ROLE_ORIGINS, ROLE_SIDES, ROLE_TYPES } from "@/modules/role/constants/role.constants";

type RoleName = TupleToUnion<typeof ROLE_NAMES>;

type RoleSide = TupleToUnion<typeof ROLE_SIDES>;

type RoleType = TupleToUnion<typeof ROLE_TYPES>;

type RoleOrigin = TupleToUnion<typeof ROLE_ORIGINS>;

export type {
  RoleName,
  RoleSide,
  RoleType,
  RoleOrigin,
};