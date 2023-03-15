const { OFF } = require("../../constants");

const schemaFilesOverride = Object.freeze({
  files: ["*.schema.ts"],
  rules: { "max-len": OFF },
});

module.exports = { schemaFilesOverride };