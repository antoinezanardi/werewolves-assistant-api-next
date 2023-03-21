const { OFF } = require("../../constants");

const serviceFilesOverride = Object.freeze({
  files: ["*.service.ts"],
  rules: { "class-methods-use-this": OFF },
});

module.exports = { serviceFilesOverride };