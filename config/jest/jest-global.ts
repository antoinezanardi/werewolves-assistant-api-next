import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  testRegex: ["tests/unit/.+.spec.ts", "tests/e2e/.+.e2e-spec.ts"],
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  verbose: true,
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["main.ts$"],
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