const defaultConfig = require("./stryker.conf");

const reporters = ["progress-append-only"];

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
  ...defaultConfig,
  dryRunTimeoutMinutes: 10,
  reporters,
  dashboard,
};