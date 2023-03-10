const { OFF } = require("../../constants");

const factoryFilesOverride = Object.freeze({
  files: ["*.factory.ts"],
  rules: { "@typescript-eslint/no-magic-numbers": OFF },
});

module.exports = { factoryFilesOverride };