const { OFF } = require("../eslint.constants");

const ESLINT_FACTORIES_CONFIG = Object.freeze({
  name: "factories",
  files: ["**/*.factory.ts"],
  rules: {
    "import/max-dependencies": OFF,
  },
});

module.exports = ESLINT_FACTORIES_CONFIG;