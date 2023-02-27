const MAX_LENGTH = 180;
const MAX_NESTED_CALLBACK = 5;
const MAX_PARAMS = 6;
const INDENT_SPACE_COUNT = 2;
const ERROR = "error";
const WARNING = "warn";
const OFF = "off";
const MAX_LENGTH_DEFAULT_CONFIG = {
  code: MAX_LENGTH,
  ignoreTemplateLiterals: true,
  ignorePattern: "d=\"([\\s\\S]*?)\"",
};
const BOOLEAN_PREFIXES = ["is", "was", "should", "has", "can", "does"];
const NAMING_CONVENTION_DEFAULT_CONFIG = [
  {
    selector: ["enum", "enumMember"],
    format: ["UPPER_CASE"],
  }, {
    selector: ["class", "interface", "typeParameter"],
    format: ["PascalCase"],
  }, {
    selector: ["function", "classProperty", "classMethod", "accessor"],
    format: ["camelCase"],
  }, {
    selector: ["variable", "classProperty"],
    types: ["boolean"],
    format: ["PascalCase"],
    prefix: BOOLEAN_PREFIXES,
  },
];

module.exports = {
  MAX_LENGTH,
  MAX_NESTED_CALLBACK,
  MAX_PARAMS,
  INDENT_SPACE_COUNT,
  ERROR,
  WARNING,
  OFF,
  MAX_LENGTH_DEFAULT_CONFIG,
  NAMING_CONVENTION_DEFAULT_CONFIG,
};