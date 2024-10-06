const { ERROR } = require("../eslint.constants");

const ESLINT_MODULE_CONFIG = Object.freeze({
  name: "modules",
  files: ["**/*.module.ts"],
  rules: {
    "import/max-dependencies": [ERROR, { max: 30 }],
  },
});

module.exports = ESLINT_MODULE_CONFIG;