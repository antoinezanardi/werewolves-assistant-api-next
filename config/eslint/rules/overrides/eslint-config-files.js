const { OFF } = require("../../constants");

const eslintConfigFilesOverride = Object.freeze({
  files: [".eslintrc.js", "config/eslint/**/*.js"],
  rules: {
    "max-len": OFF,
    "@typescript-eslint/no-require-imports": OFF,
    "@typescript-eslint/no-var-requires": OFF,
    "import/no-commonjs": OFF,
    "import/no-internal-modules": OFF,
  },
});

module.exports = { eslintConfigFilesOverride };