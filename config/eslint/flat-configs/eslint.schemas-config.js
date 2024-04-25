const ESLINT_SCHEMAS_CONFIG = Object.freeze({
  name: "schemas",
  files: ["**/*.schema.ts"],
  rules: {},
  // rules: {"import/max-dependencies": [ERROR, { max: 30 }],},
});

module.exports = ESLINT_SCHEMAS_CONFIG;