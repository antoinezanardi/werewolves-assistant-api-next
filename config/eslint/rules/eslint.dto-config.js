const { OFF, ERROR } = require("../constants");

const ESLINT_DTO_CONFIG = Object.freeze({
  files: ["**/*.dto.ts"],
  rules: {
    "max-len": OFF,
    // "import/max-dependencies": [ERROR, { max: 30 }],
  },
});

module.exports = ESLINT_DTO_CONFIG;