const { importRules } = require("./config/eslint/rules/import");
const { configFilesOverride } = require("./config/eslint/rules/overrides/config-files");
const { decoratorFilesOverride } = require("./config/eslint/rules/overrides/decorator-files");
const { dtoFilesOverride } = require("./config/eslint/rules/overrides/dto-files");
const { eslintConfigFilesOverride } = require("./config/eslint/rules/overrides/eslint-config-files");
const { factoryFilesOverride } = require("./config/eslint/rules/overrides/factory-files");
const { testFilesOverride } = require("./config/eslint/rules/overrides/test-files");
const { standardRules } = require("./config/eslint/rules/standard");
const { typescriptRules } = require("./config/eslint/rules/typescript");

module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "import", "jest"],
  ignorePatterns: ["node_modules/", "dist/"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2022,
    project: "./tsconfig.json",
    sourceType: "module",
  },
  rules: {
    ...standardRules,
    ...typescriptRules,
    ...importRules,
  },
  overrides: [
    eslintConfigFilesOverride,
    configFilesOverride,
    testFilesOverride,
    dtoFilesOverride,
    factoryFilesOverride,
    decoratorFilesOverride,
  ],
};