const { ERROR } = require("../eslint.constants");

const ESLINT_SCHEMAS_CONFIG = Object.freeze({
  name: "schemas",
  files: ["**/*.schema.ts"],
  rules: { "import/max-dependencies": [ERROR, { max: 30 }] },
});

module.exports = ESLINT_SCHEMAS_CONFIG;