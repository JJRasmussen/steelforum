import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import pluginJest from "eslint-plugin-jest";
import pluginN from "eslint-plugin-n"

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"] 
  },
  { files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { 
      globals: { 
        ...globals.browser,
        ...globals.node
      } 
    }
  },
  {
    files: ["**/*.js"],
    plugins: { js, n: pluginN },
    rules: {
      //allow unused variables if they are prefixed with _
      "no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],

      //complexity and line limits
      "complexity": ["warn", { max: 10 }],
      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],

      //no hard coded values
      "no-magic-numbers": ["warn", { ignore: [0, 1, -1], ignoreArrayIndexes: true, enforceConst: true }],
      //enforce strict equality 
      "eqeqeq": ["error", "always"],
      //proper return handling
      "n/callback-return": "warn",
      "consistent-return": "warn",
      //no declared variable should override a variable from an outer scope
      "no-shadow": "warn",
      //a let declaration that is never changed should be a const
      "prefer-const": "warn",
    }
  },
  //Test-specific config
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  }
]);
