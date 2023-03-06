import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  testRegex: "tests/unit/specs/.+.spec.ts",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  verbose: true,
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  detectLeaks: true,
  setupFiles: ["<rootDir>/tests/unit/unit-setup.ts"],
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

export default config;