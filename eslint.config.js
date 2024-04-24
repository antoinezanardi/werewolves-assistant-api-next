const ESLINT_CONFIGS_CONFIG = require("./config/eslint/rules/eslint-configs-config");
const ESLINT_BASE_CONFIG = require("./config/eslint/rules/eslint.base-config");
const ESLINT_TYPESCRIPT_CONFIG = require("./config/eslint/rules/eslint.typescript-config");
const ESLINT_CONSTANTS_CONFIG = require("./config/eslint/rules/eslint.constants-config");
const ESLINT_DTO_CONFIG = require("./config/eslint/rules/eslint.dto-config");
const ESLINT_SCHEMAS_CONFIG = require("./config/eslint/rules/eslint.schemas-config");
const ESLINT_PIPES_CONFIG = require("./config/eslint/rules/eslint.pipes-config");
const ESLINT_DECORATORS_CONFIG = require("./config/eslint/rules/eslint.decorators-config");
const ESLINT_TESTS_CONFIG = require("./config/eslint/rules/eslint.tests-config");
const ESLINT_FACTORIES_CONFIG = require("./config/eslint/rules/eslint.factories-config");
const ESLINT_SERVICES_CONFIG = require("./config/eslint/rules/eslint.services-config");
const ESLINT_CONTROLLERS_CONFIG = require("./config/eslint/rules/eslint.controllers-config");
const ESLINT_CUCUMBER_STEPS_AND_HOOKS_CONFIG = require("./config/eslint/rules/eslint.cucumber-steps-and-hooks-config");
const {ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG} = require("./config/eslint/rules/eslint.cucumber-context-helper-config");
const {OFF} = require("./config/eslint/constants");
// const ESLINT_IMPORT_CONFIG = require("./rules/eslint.import-config");

module.exports = [
  {
    linterOptions: {reportUnusedDisableDirectives: OFF},
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        process: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
  ESLINT_BASE_CONFIG,
  ESLINT_TYPESCRIPT_CONFIG,
  // TODO: Uncomment the following line when import plugin supports eslint v9
  // - ESLINT_IMPORT_CONFIG,
  ESLINT_CONFIGS_CONFIG,
  ESLINT_CONSTANTS_CONFIG,
  ESLINT_DTO_CONFIG,
  ESLINT_SCHEMAS_CONFIG,
  ESLINT_PIPES_CONFIG,
  ESLINT_DECORATORS_CONFIG,
  ESLINT_TESTS_CONFIG,
  ESLINT_FACTORIES_CONFIG,
  ESLINT_SERVICES_CONFIG,
  ESLINT_CONTROLLERS_CONFIG,
  ESLINT_CUCUMBER_STEPS_AND_HOOKS_CONFIG,
  ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG,
];