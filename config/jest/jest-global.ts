import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  testRegex: ["tests/unit/.+.spec.ts", "tests/e2e/.+.e2e-spec.ts"],
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  verbose: true,
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  setupFiles: ["<rootDir>/tests/global-setup.ts"],
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts",
    "!src/**/*dto.ts",
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