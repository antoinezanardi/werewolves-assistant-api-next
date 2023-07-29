const reporters = ["clear-text", "progress", "html", "json"];
const dashboard = {
  project: "github.com/antoinezanardi/werewolves-assistant-api-next",
  baseUrl: "https://dashboard.stryker-mutator.io/api/reports",
  reportType: "full",
};
const version = process.env.VERSION;

if (process.env.STRYKER_DASHBOARD_API_KEY !== undefined) {
  reporters.push("dashboard");
}

if (process.env.VERSION !== undefined) {
  dashboard.version = version;
}

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
  jest: { configFile: "config/jest/jest-global.ts" },
  reporters,
  htmlReporter: { fileName: "tests/stryker/coverage/index.html" },
  jsonReporter: { fileName: "tests/stryker/coverage/mutation.json" },
  thresholds: {
    high: 100,
    low: 100,
    break: 100,
  },
  disableTypeChecks: "{tests,src,lib}/**/*.{js,ts,jsx,tsx,html,vue}",
  dashboard,
};