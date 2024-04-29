const { OFF } = require("../eslint.constants");
const ESLINT_DTO_CONFIG = Object.freeze({
  name: "dto",
  files: ["**/*.dto.ts"],
  rules: {
    "@stylistic/max-len": OFF,
    // "import/max-dependencies": [ERROR, { max: 30 }],
  },
});

module.exports = ESLINT_DTO_CONFIG;