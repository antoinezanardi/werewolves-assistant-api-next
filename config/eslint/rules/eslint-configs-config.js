const { OFF } = require("../constants");

const ESLINT_CONFIGS_CONFIG = Object.freeze({
  files: ["config/**/*.ts", "config/**/*.js"],
  rules: {
    "@typescript-eslint/no-require-imports": OFF,
    "@typescript-eslint/no-restricted-imports": OFF,
    "@typescript-eslint/no-var-requires": OFF,
    "import/no-default-export": OFF,
    "import/no-relative-parent-imports": OFF,
  },
});

module.exports = ESLINT_CONFIGS_CONFIG;