const { OFF } = require("../constants");

const ESLINT_PIPES_CONFIG = Object.freeze({
  files: ["**/*.pipe.ts"],
  rules: { "class-methods-use-this": OFF },
});

module.exports = ESLINT_PIPES_CONFIG;