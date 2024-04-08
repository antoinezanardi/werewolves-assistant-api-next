import type { TupleToUnion } from "type-fest";

import type { ROLE_NAMES } from "@/modules/role/constants/role.constants";

type RoleName = TupleToUnion<typeof ROLE_NAMES>;

export type { RoleName };