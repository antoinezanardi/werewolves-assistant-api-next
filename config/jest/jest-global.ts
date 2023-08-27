import { pathsToModuleNameMapper } from "ts-jest";
import type { Config } from "jest";

import { compilerOptions } from "../../tsconfig.json";

const config: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ["<rootDir>"],
  testRegex: ["tests/unit/.+.spec.ts", "tests/e2e/.+.e2e-spec.ts"],
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  maxConcurrency: 1,
  maxWorkers: 1,
  setupFiles: ["<rootDir>/tests/global-setup.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  coverageReporters: ["clover", "json-summary", "lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts",
    "!src/**/*dto.ts",
    "!src/**/*.schema.ts",
  ],
  coverageDirectory: "tests/coverage",
  coverageThreshold: {
    global: {
      statements: 100,
      lines: 100,
      branches: 100,
      functions: 100,
    },
  },
};

export default config;