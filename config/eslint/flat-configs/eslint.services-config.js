const { OFF } = require("../eslint.constants");

const ESLINT_SERVICES_CONFIG = Object.freeze({
  name: "services",
  files: ["**/*.service.ts"],
  rules: {
    "class-methods-use-this": OFF,
    "no-useless-constructor": OFF,
    "@typescript-eslint/class-methods-use-this": OFF,
  },
});

module.exports = ESLINT_SERVICES_CONFIG;