import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: "../../",
  testEnvironment: "node",
  testRegex: "tests/unit/.+.spec.ts",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  verbose: true,
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary"],
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["main.ts$", ".module.ts$", ".controller.ts$"],
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