const { OFF } = require("../eslint.constants");

const ESLINT_PIPES_CONFIG = Object.freeze({
  name: "pipes",
  files: ["**/*.pipe.ts"],
  rules: {
    "class-methods-use-this": OFF,
    "no-useless-constructor": OFF,
    "@typescript-eslint/class-methods-use-this": OFF,
  },
});

module.exports = ESLINT_PIPES_CONFIG;