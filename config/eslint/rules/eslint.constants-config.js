const { OFF } = require("../constants");

const ESLINT_CONSTANTS_CONFIG = Object.freeze({
  files: ["**/*.constants.ts"],
  rules: {
    "max-len": OFF,
    "@typescript-eslint/no-magic-numbers": OFF,
  },
});

module.exports = ESLINT_CONSTANTS_CONFIG;