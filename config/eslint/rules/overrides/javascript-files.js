const { OFF } = require("../../constants");

const javascriptFilesOverride = Object.freeze({
  files: ["**/*.js"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": OFF,
    "@typescript-eslint/no-unsafe-assignment": OFF,
    "@typescript-eslint/no-unsafe-call": OFF,
    "@typescript-eslint/no-unsafe-member-access": OFF,
  },
});

module.exports = { javascriptFilesOverride };