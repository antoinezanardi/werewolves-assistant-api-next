const { OFF } = require("../../constants");

const configFilesOverride = Object.freeze({
  files: ["./config/**/*.ts"],
  rules: {
    "@typescript-eslint/no-restricted-imports": OFF,
    "import/no-default-export": OFF,
    "import/no-relative-parent-imports": OFF,
  },
});

module.exports = { configFilesOverride };