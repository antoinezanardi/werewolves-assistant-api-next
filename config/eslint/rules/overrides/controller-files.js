const { OFF } = require("../../constants");

const controllerFilesOverride = Object.freeze({
  files: ["*.controller.ts"],
  rules: {
    "class-methods-use-this": OFF,
    "@typescript-eslint/no-empty-function": OFF,
  },
});

module.exports = { controllerFilesOverride };