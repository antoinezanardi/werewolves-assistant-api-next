const { OFF } = require("../../constants");

const dtoFilesOverride = Object.freeze({
  files: ["*.dto.ts"],
  rules: { "max-len": OFF },
});

module.exports = { dtoFilesOverride };