const { OFF } = require("../../constants");

const constantFilesOverride = Object.freeze({
  files: ["*.constant.ts"],
  rules: {
    "max-len": OFF,
    "@typescript-eslint/no-magic-numbers": OFF,
  },
});

module.exports = { constantFilesOverride };