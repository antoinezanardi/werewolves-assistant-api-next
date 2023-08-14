const { OFF, ERROR } = require("../../constants");

const cucumberStepsAndHooksFilesOverride = Object.freeze({
  files: ["tests/acceptance/features/**/*.ts"],
  rules: {
    "func-style": [ERROR, "declaration", { allowArrowFunctions: false }],
    "prefer-arrow-callback": OFF,
    "func-names": [ERROR, "never"],
  },
});

module.exports = { cucumberStepsAndHooksFilesOverride };