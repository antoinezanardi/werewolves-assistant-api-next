import { readFileSync } from "fs";

import type { FeatureName } from "@tests/acceptance/shared/types/feature.types";

function readJsonFile<T>(feature: FeatureName, fileName: string): T {
  const path = `tests/acceptance/features/${feature}/data/${fileName}`;
  const data = readFileSync(path, "utf-8");
  return JSON.parse(data) as T;
}

export { readJsonFile };