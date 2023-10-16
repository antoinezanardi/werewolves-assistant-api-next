import { pathsToModuleNameMapper } from "ts-jest";
import type { Config } from "jest";

import { compilerOptions } from "../../tsconfig.json";

const JEST_E2E_CONFIG: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ["<rootDir>"],
  testRegex: "tests/e2e/.+.e2e-spec.ts",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: "50%",
  clearMocks: true,
  setupFilesAfterEnv: ["jest-extended/all"],
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "src/**/*.module.ts",
    "src/**/*.controller.ts",
    "src/**/*.repository.ts",
  ],
  coverageDirectory: "tests/e2e/coverage",
  coverageThreshold: {
    global: {
      statements: 100,
      lines: 100,
      branches: 100,
      functions: 100,
    },
  },
};

export default JEST_E2E_CONFIG;