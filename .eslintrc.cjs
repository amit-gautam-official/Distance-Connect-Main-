/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/consistent-type-imports": "off",

    "@next/next/no-img-element": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@next/next/no-html-link-for-pages": "off",
    "jsx-a11y/alt-text": "off",
    "react-hooks/rules-of-hooks": "off",
    "prefer-const": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-wrapper-object-types": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    
  },
}
module.exports = config;