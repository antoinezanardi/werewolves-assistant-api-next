import { pathsToModuleNameMapper } from "ts-jest";
import type { Config } from "jest";

import { compilerOptions } from "../../tsconfig.json";

const JEST_UNIT_CONFIG: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ["<rootDir>"],
  testRegex: "tests/unit/specs/.+.spec.ts",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  setupFiles: ["<rootDir>/tests/unit/unit-setup.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts",
    "!src/**/*.module.ts",
    "!src/**/*.controller.ts",
    "!src/**/*.repository.ts",
    "!src/**/*.dto.ts",
    "!src/**/*.schema.ts",
  ],
  coverageDirectory: "tests/unit/coverage",
  coverageThreshold: {
    global: {
      statements: 100,
      lines: 100,
      branches: 100,
      functions: 100,
    },
  },
};

export default JEST_UNIT_CONFIG;