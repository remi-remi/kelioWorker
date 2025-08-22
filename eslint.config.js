import js from "@eslint/js"
import globals from "globals"
import importPlugin from "eslint-plugin-import"
import n from "eslint-plugin-n"
import promise from "eslint-plugin-promise"

export default [
   js.configs.recommended,

   {
      files: ["**/*.js", "**/*.mjs"],
      ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],

      languageOptions: {
         ecmaVersion: 2020,
         sourceType: "module",
         globals: {
            ...globals.node
         }
      },

      plugins: {
         import: importPlugin,
         n,
         promise
      },

      rules: {
         "import/no-unresolved": "error",
         "import/order": ["warn", { "newlines-between": "always" }],
         "import/newline-after-import": "warn",

         "n/no-missing-import": "error",
         "n/no-unsupported-features/es-syntax": "off",
         "n/prefer-global/process": "warn",
         "n/prefer-global/url": "warn",

         // ----- Promises -----
         "promise/always-return": "off",
         "promise/no-return-wrap": "error",
         "promise/param-names": "error",
         "promise/no-nesting": "warn",
         "promise/no-promise-in-callback": "warn",
         "promise/no-callback-in-promise": "warn",
         "promise/no-multiple-resolved": "error",

         // ----- Q.O.L -----
         "no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
         "no-constant-condition": ["error", { checkLoops: false }],
         "no-console": "off"
      }
   },

   {
      files: ["**/*.cjs"],
      languageOptions: {
         ecmaVersion: 2020,
         sourceType: "script",
         globals: {
            ...globals.node
         }
      }
   }
]

