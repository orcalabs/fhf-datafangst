import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["src/assets/", "src/generated/", "**/*.{js,mjs}"] },
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "tsconfig.json",
      },
    },
    rules: {
      "import/no-cycle": [2, { maxDepth: "∞" }],
      "import/no-duplicates": "off",

      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",

      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/space-before-function-paren": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/return-await": "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/method-signature-style": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "space-before-function-paren": "off",
      "no-case-declarations": "off",
      "multiline-ternary": "off",
      curly: "off",
    },
  },
];
