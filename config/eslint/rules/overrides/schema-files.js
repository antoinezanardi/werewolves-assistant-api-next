const { OFF, ERROR } = require("../../constants");

const schemaFilesOverride = Object.freeze({
  files: ["*.schema.ts"],
  rules: {
    "max-len": OFF,
    "import/max-dependencies": [ERROR, { max: 30 }],
  },
});

module.exports = { schemaFilesOverride };