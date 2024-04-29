const { OFF } = require("../eslint.constants");

const ESLINT_REPOSITORIES_CONFIG = Object.freeze({
  name: "repositories",
  files: ["**/*.repository.ts"],
  rules: { "no-useless-constructor": OFF },
});

module.exports = ESLINT_REPOSITORIES_CONFIG;