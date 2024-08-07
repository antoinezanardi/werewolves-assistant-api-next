const ESLINT_CONFIGS_CONFIG = require("./config/eslint/flat-configs/eslint-configs-config");
const ESLINT_GLOBAL_CONFIG = require("./config/eslint/flat-configs/eslint.global-config");
const ESLINT_TYPESCRIPT_CONFIG = require("./config/eslint/flat-configs/eslint.typescript-config");
const ESLINT_CONSTANTS_CONFIG = require("./config/eslint/flat-configs/eslint.constants-config");
const ESLINT_DTO_CONFIG = require("./config/eslint/flat-configs/eslint.dto-config");
const ESLINT_SCHEMAS_CONFIG = require("./config/eslint/flat-configs/eslint.schemas-config");
const ESLINT_PIPES_CONFIG = require("./config/eslint/flat-configs/eslint.pipes-config");
const ESLINT_DECORATORS_CONFIG = require("./config/eslint/flat-configs/eslint.decorators-config");
const ESLINT_TESTS_CONFIG = require("./config/eslint/flat-configs/eslint.tests-config");
const ESLINT_FACTORIES_CONFIG = require("./config/eslint/flat-configs/eslint.factories-config");
const ESLINT_SERVICES_CONFIG = require("./config/eslint/flat-configs/eslint.services-config");
const ESLINT_CONTROLLERS_CONFIG = require("./config/eslint/flat-configs/eslint.controllers-config");
const ESLINT_CUCUMBER_STEPS_AND_HOOKS_CONFIG = require("./config/eslint/flat-configs/eslint.cucumber-steps-and-hooks-config");
const { ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG } = require("./config/eslint/flat-configs/eslint.cucumber-context-helper-config");
const { OFF } = require("./config/eslint/eslint.constants");
const ESLINT_REPOSITORIES_CONFIG = require("./config/eslint/flat-configs/eslint.repositories-config");
const ESLINT_STYLISTIC_CONFIG = require("./config/eslint/flat-configs/eslint.stylistic-config");
// const ESLINT_IMPORT_CONFIG = require("./rules/eslint.import-config");

module.exports = [
  {
    name: "global-linter-options",
    linterOptions: { reportUnusedDisableDirectives: OFF },
  },
  ESLINT_GLOBAL_CONFIG,
  ESLINT_STYLISTIC_CONFIG,
  ESLINT_TYPESCRIPT_CONFIG,
  /*
   * TODO: Uncomment the following line when import plugin supports eslint v9
   * - ESLINT_IMPORT_CONFIG,
   */
  ESLINT_CONFIGS_CONFIG,
  ESLINT_CONSTANTS_CONFIG,
  ESLINT_DTO_CONFIG,
  ESLINT_SCHEMAS_CONFIG,
  ESLINT_PIPES_CONFIG,
  ESLINT_DECORATORS_CONFIG,
  ESLINT_TESTS_CONFIG,
  ESLINT_FACTORIES_CONFIG,
  ESLINT_SERVICES_CONFIG,
  ESLINT_REPOSITORIES_CONFIG,
  ESLINT_CONTROLLERS_CONFIG,
  ESLINT_CUCUMBER_STEPS_AND_HOOKS_CONFIG,
  ESLINT_CUCUMBER_CONTEXT_HELPERS_CONFIG,
];