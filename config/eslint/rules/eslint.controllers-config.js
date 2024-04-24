const { OFF } = require("../constants");

const ESLINT_CONTROLLERS_CONFIG = Object.freeze({
  name: "eslint-controllers",
  files: ["**/*.controller.ts"],
  rules: {
    "class-methods-use-this": OFF,
    "@typescript-eslint/no-empty-function": OFF,
  },
});

module.exports = ESLINT_CONTROLLERS_CONFIG;