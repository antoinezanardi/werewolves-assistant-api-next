const { OFF } = require("../../constants");

const schemaFilesOverride = Object.freeze({
  files: ["*.schema.ts"],
  rules: {
    "max-len": OFF,
    "@typescript-eslint/no-magic-numbers": OFF,
  },
});

module.exports = { schemaFilesOverride };