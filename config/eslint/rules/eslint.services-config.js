const { OFF } = require("../constants");

const ESLINT_SERVICES_CONFIG = Object.freeze({
  name: "eslint-services",
  files: ["**/*.service.ts"],
  rules: { "class-methods-use-this": OFF },
});

module.exports = ESLINT_SERVICES_CONFIG;