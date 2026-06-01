import js from "@eslint/js";
import globals from "globals";
import jsonPlugin from "@eslint/json";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";
import type { Plugin } from "@eslint/core";

export default defineConfig([
   // JavaScript (Node)
   {
      files: ["**/*.{js,mjs,cjs}"],
      languageOptions: {
         globals: globals.node,
         ecmaVersion: "latest",
         sourceType: "module",
      },
      plugins: { js },
      rules: {
         ...js.configs.recommended.rules,
         "no-unused-vars": "off",
      },
      settings: {
         "import/resolver": {
            typescript: {
               project: "./tsconfig.json"
            }
         }
      }

   },

   // TypeScript (Node)
   {
      files: ["**/*.ts"],
      languageOptions: {
         globals: globals.node,
         parser: tsParser,
         parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
         },
      },
      plugins: {
         "@typescript-eslint": tsPlugin as unknown as Plugin,
      },
      rules: {
         ...tsPlugin.configs.recommended.rules,
         "@typescript-eslint/no-unused-vars": "off",
         "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports" },
         ],
      },
      settings: {
         "import/resolver": {
            typescript: {
               project: "./tsconfig.json"
            }
         }
      }

   },

   {
      files: ["**/*.json"],
      plugins: { json: jsonPlugin },
   },

   // Ignored paths
   {
      ignores: [
         "node_modules/",
         "dist/",
         "logs/",
         "*.log",
         "*.sql",
         "*.pem",
         "*.key",
         ".env",
         ".env.*",
         "*.csv",
         "*.csv*",
         ".vscode/",
         ".idea/",
         ".DS_Store",
      ],
   },
]);

