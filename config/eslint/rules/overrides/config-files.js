const { OFF } = require("../../constants");

const configFilesOverride = Object.freeze({
  files: ["./config/**/*.ts"],
  rules: { "import/no-default-export": OFF },
});

module.exports = { configFilesOverride };