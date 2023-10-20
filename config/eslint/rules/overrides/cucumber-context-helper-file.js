const { OFF } = require("../../constants");

const cucumberContextHelperFile = Object.freeze({
  files: ["tests/acceptance/shared/helpers/context.helper.ts"],
  rules: { "no-param-reassign": OFF },
});

module.exports = { cucumberContextHelperFile };