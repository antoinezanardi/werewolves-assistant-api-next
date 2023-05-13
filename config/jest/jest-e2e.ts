import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  testRegex: "tests/e2e/.+.e2e-spec.ts",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  resetMocks: true,
  restoreMocks: true,
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

export default config;