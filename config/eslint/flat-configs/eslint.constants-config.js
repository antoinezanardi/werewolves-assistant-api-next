const { OFF } = require("../eslint.constants");

const ESLINT_CONSTANTS_CONFIG = Object.freeze({
  name: "constants",
  files: ["**/*.constants.ts"],
  rules: {
    "@typescript-eslint/no-magic-numbers": OFF,
    "@stylistic/max-len": OFF,
  },
});

module.exports = ESLINT_CONSTANTS_CONFIG;