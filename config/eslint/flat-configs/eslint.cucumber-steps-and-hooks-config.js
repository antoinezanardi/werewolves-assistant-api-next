const { OFF, ERROR } = require("../eslint.constants");

const ESLINT_CUCUMBER_STEPS_AND_HOOKS_CONFIG = Object.freeze({
  name: "cucumber-steps-and-hooks",
  files: ["tests/acceptance/features/**/*.ts"],
  rules: {
    "func-style": [ERROR, "declaration", { allowArrowFunctions: false }],
    "prefer-arrow-callback": OFF,
    "func-names": [ERROR, "never"],
    "@typescript-eslint/max-params": [ERROR, { max: 6 }],
  },
});

module.exports = ESLINT_CUCUMBER_STEPS_AND_HOOKS_CONFIG;