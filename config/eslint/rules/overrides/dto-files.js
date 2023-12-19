const { OFF, ERROR } = require("../../constants");

const dtoFilesOverride = Object.freeze({
  files: ["*.dto.ts"],
  rules: {
    "max-len": OFF,
    "import/max-dependencies": [ERROR, { max: 30 }],
  },
});

module.exports = { dtoFilesOverride };