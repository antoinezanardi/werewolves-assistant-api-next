const { OFF, ERROR } = require("../constants");

const ESLINT_SCHEMAS_CONFIG = Object.freeze({
  files: ["**/*.schema.ts"],
  rules: {},
  // rules: {"import/max-dependencies": [ERROR, { max: 30 }],},
});

module.exports = ESLINT_SCHEMAS_CONFIG;