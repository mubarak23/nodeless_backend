
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";

export default [
	js.configs.recommended,
	{
		files: ["**/*.ts", "**/*.tsx"],
		ignores: ["dist/**", "node_modules/**"],
		languageOptions: {
			parser: tsParser,
			sourceType: "module",
			globals: {
				console: "writable",
				process: "readonly",
				__dirname: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": ts,
			prettier,
		},
		rules: {
			...ts.configs.recommended.rules,
			"prettier/prettier": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		},
	},
	prettierConfig,
];
