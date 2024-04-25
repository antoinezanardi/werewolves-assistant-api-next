const { OFF } = require("../eslint.constants");

const ESLINT_CONSTANTS_CONFIG = Object.freeze({
  name: "constants",
  files: ["**/*.constants.ts"],
  rules: {
    "max-len": OFF,
    "@typescript-eslint/no-magic-numbers": OFF,
  },
});

module.exports = ESLINT_CONSTANTS_CONFIG;