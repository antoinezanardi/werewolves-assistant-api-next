const { OFF } = require("../eslint.constants");

const ESLINT_CONFIGS_CONFIG = Object.freeze({
  name: "configs",
  files: ["config/**/*.ts", "config/**/*.js"],
  rules: {
    "no-magic-numbers": OFF,
    "@typescript-eslint/no-require-imports": OFF,
    "@typescript-eslint/no-restricted-imports": OFF,
    "import/no-default-export": OFF,
    "import/no-relative-parent-imports": OFF,
  },
});

module.exports = ESLINT_CONFIGS_CONFIG;