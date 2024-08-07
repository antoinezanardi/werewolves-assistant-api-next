const { OFF, ERROR } = require("../eslint.constants");

const ESLINT_IMPORT_CONFIG = Object.freeze({
  name: "import",
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  settings: {
    "import/parsers": { espree: [".js", ".cjs", ".mjs", ".jsx"] },
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    /*
     * ---- ESLint Import Rules -----
     * - Static analysis (https://github.com/import-js/eslint-plugin-import#static-analysis)
     * TODO: Modify webpack for this
     */
    "import/no-unresolved": OFF,
    // TODO: Need to check config of this rule
    "import/default": ERROR,
    "import/named": OFF,
    "import/namespace": ERROR,
    "import/no-restricted-paths": ERROR,
    "import/no-absolute-path": ERROR,
    // TODO: Need to check config of this rule
    "import/no-dynamic-require": ERROR,
    // TODO: Need to check config of this rule
    "import/no-internal-modules": ERROR,
    "import/no-webpack-loader-syntax": ERROR,
    "import/no-self-import": ERROR,
    "import/no-cycle": ERROR,
    "import/no-useless-path-segments": ERROR,
    "import/no-relative-parent-imports": ERROR,
    "import/no-relative-packages": ERROR,
    // - Helpful warnings (https://github.com/import-js/eslint-plugin-import#helpful-warnings)
    "import/export": ERROR,
    "import/no-named-as-default": ERROR,
    "import/no-named-as-default-member": ERROR,
    "import/no-deprecated": ERROR,
    "import/no-extraneous-dependencies": [ERROR, { peerDependencies: false }],
    "import/no-mutable-exports": ERROR,
    "import/no-unused-modules": [ERROR, { unusedExports: true }],
    // - Module systems (https://github.com/import-js/eslint-plugin-import#module-systems)
    "import/unambiguous": OFF,
    "import/no-commonjs": OFF,
    "import/no-amd": ERROR,
    "import/no-nodejs-modules": OFF,
    "import/no-import-module-exports": ERROR,
    // - Style guide (https://github.com/import-js/eslint-plugin-import#style-guide)
    "import/first": ERROR,
    "import/exports-last": ERROR,
    "import/no-duplicates": ERROR,
    "import/no-namespace": ERROR,
    // TODO: Check this rule config
    "import/extensions": OFF,
    "import/order": [
      ERROR, {
        "warnOnUnassignedImports": true,
        "groups": ["builtin", "external", "internal", "parent", "sibling"],
        "pathGroups": [
          { pattern: "@/modules/**", group: "parent" },
          { pattern: "@/server/**", group: "parent", position: "after" },
          { pattern: "@/shared/**", group: "parent", position: "after" },
          { pattern: "@tests/**", group: "parent", position: "after" },
        ],
        "pathGroupsExcludedImportTypes": ["@tests/"],
        "newlines-between": "always",
      },
    ],
    "import/newline-after-import": ERROR,
    "import/prefer-default-export": OFF,
    "import/max-dependencies": [
      ERROR, {
        max: 25,
        ignoreTypeImports: true,
      },
    ],
    "import/no-unassigned-import": [ERROR, { allow: ["**/*.css"] }],
    "import/no-named-default": ERROR,
    "import/no-default-export": ERROR,
    "import/no-named-export": OFF,
    "import/no-anonymous-default-export": OFF,
    "import/group-exports": ERROR,
    // TODO: Check this rule
    "import/dynamic-import-chunkname": OFF,
  },
});

module.exports = ESLINT_IMPORT_CONFIG;