const { OFF, ERROR } = require("../../constants");

const factoryFilesOverride = Object.freeze({
  files: ["*.factory.ts"],
  rules: {
    "@typescript-eslint/no-magic-numbers": OFF,
    "import/max-dependencies": [
      ERROR, {
        max: 30,
        ignoreTypeImports: true,
      },
    ],
  },
});

module.exports = { factoryFilesOverride };