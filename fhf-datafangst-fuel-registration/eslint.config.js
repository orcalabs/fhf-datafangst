import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["src/generated/**/*", "old_src/**/*", "**/*.{js,mjs}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["tsconfig.app.json", "tsconfig.node.json"],
      },
    },
    rules: {
      // TODO
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/incompatible-library": "off",
      "react-refresh/only-export-components": "off",
      "react-hooks/static-components": "off",
      "react-hooks/refs": "off",

      "react-hooks/exhaustive-deps": "off",

      "@typescript-eslint/no-deprecated": "warn",
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
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "separate-type-imports" },
      ],

      "space-before-function-paren": "off",
      "no-case-declarations": "off",
      "multiline-ternary": "off",
      curly: "off",
    },
  },
]);
