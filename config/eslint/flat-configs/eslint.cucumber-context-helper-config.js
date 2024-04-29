const { OFF } = require("../eslint.constants");

const ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG = Object.freeze({
  name: "cucumber-context-helpers",
  files: ["tests/acceptance/shared/helpers/context.helpers.ts"],
  rules: { "no-param-reassign": OFF },
});

module.exports = { ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG };