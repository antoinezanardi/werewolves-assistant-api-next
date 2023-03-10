const { OFF } = require("../../constants");

const dtoFilesOverride = Object.freeze({
  files: ["*.dto.ts"],
  rules: {
    "max-len": OFF,
    "@typescript-eslint/no-magic-numbers": OFF,
  },
});

module.exports = { dtoFilesOverride };