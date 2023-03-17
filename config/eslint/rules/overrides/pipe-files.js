const { OFF } = require("../../constants");

const pipeFilesOverride = Object.freeze({
  files: ["*.pipe.ts"],
  rules: { "class-methods-use-this": OFF },
});

module.exports = { pipeFilesOverride };