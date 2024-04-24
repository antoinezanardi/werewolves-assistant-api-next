const { ERROR, NAMING_CONVENTION_DEFAULT_CONFIG } = require("../constants");

const ESLINT_DECORATORS_CONFIG = Object.freeze({
  files: ["**/*.decorator.ts"],
  rules: {
    "@typescript-eslint/naming-convention": [
      ERROR,
      ...[
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        ...NAMING_CONVENTION_DEFAULT_CONFIG,
      ],
    ],
  },
});

module.exports = ESLINT_DECORATORS_CONFIG;