const { OFF } = require("../eslint.constants");

const ESLINT_CONTROLLERS_CONFIG = Object.freeze({
  name: "controllers",
  files: ["**/*.controller.ts"],
  rules: {
    "class-methods-use-this": OFF,
    "no-empty-function": OFF,
    "no-useless-constructor": OFF,
    "@typescript-eslint/no-empty-function": OFF,
    "@typescript-eslint/class-methods-use-this": OFF,
  },
});

module.exports = ESLINT_CONTROLLERS_CONFIG;