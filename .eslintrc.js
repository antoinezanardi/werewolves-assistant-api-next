const { importRules } = require("./config/eslint/rules/import");
const { configFilesOverride } = require("./config/eslint/rules/overrides/config-files");
const { constantFilesOverride } = require("./config/eslint/rules/overrides/constant-files");
const { controllerFilesOverride } = require("./config/eslint/rules/overrides/controller-files");
const { decoratorFilesOverride } = require("./config/eslint/rules/overrides/decorator-files");
const { dtoFilesOverride } = require("./config/eslint/rules/overrides/dto-files");
const { eslintConfigFilesOverride } = require("./config/eslint/rules/overrides/eslint-config-files");
const { factoryFilesOverride } = require("./config/eslint/rules/overrides/factory-files");
const { javascriptFilesOverride } = require("./config/eslint/rules/overrides/javascript-files");
const { pipeFilesOverride } = require("./config/eslint/rules/overrides/pipe-files");
const { schemaFilesOverride } = require("./config/eslint/rules/overrides/schema-files");
const { serviceFilesOverride } = require("./config/eslint/rules/overrides/service-files");
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
  ignorePatterns: ["node_modules/", "dist/", "!.releaserc.js"],
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
    javascriptFilesOverride,
    testFilesOverride,
    dtoFilesOverride,
    factoryFilesOverride,
    decoratorFilesOverride,
    schemaFilesOverride,
    constantFilesOverride,
    pipeFilesOverride,
    controllerFilesOverride,
    serviceFilesOverride,
  ],
};