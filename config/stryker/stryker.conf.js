module.exports = {
  cleanTempDir: "always",
  incremental: true,
  incrementalFile: "tests/stryker/incremental.json",
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  testRunner: "jest",
  ignoreStatic: true,
  mutate: [
    "src/**/*.ts",
    "!**/*.dto.ts",
    "!**/*.schema.ts",
    "!**/*.constant.ts",
  ],
  plugins: [
    "@stryker-mutator/jest-runner",
    "@stryker-mutator/typescript-checker",
  ],
  jest: { configFile: "config/jest/jest-global.ts" },
  reporters: ["clear-text", "progress", "html", "json"],
  htmlReporter: { fileName: "tests/stryker/coverage/index.html" },
  jsonReporter: { fileName: "tests/stryker/coverage/mutation.json" },
  thresholds: {
    high: 100,
    low: 100,
    break: 100,
  },
  disableTypeChecks: "{tests,src,lib}/**/*.{js,ts,jsx,tsx,html,vue}",
};