const ESLINT_FACTORIES_CONFIG = Object.freeze({
  name: "factories",
  files: ["*.factory.ts"],
  /*
   * rules: {
   *   "import/max-dependencies": [
   *     eRROR, {
   *       max: 30,
   *       ignoreTypeImports: true,
   *     },
   *   ],
   * },
   */
});

module.exports = ESLINT_FACTORIES_CONFIG;