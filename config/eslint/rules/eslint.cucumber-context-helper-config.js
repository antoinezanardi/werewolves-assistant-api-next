const { OFF } = require("../constants");

const ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG = Object.freeze({
  files: ["tests/acceptance/shared/helpers/context.helpers.ts"],
  rules: { "no-param-reassign": OFF },
});

module.exports = { ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG };