import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'dist/**',
			'.astro/**',
			'coverage/**',
			'resume-generator/**',
			'company-lists/**',
		],
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			globals: globals.node,
			sourceType: 'module',
		},
	},
	{
		// Astro's env.d.ts is the triple-slash reference the compiler looks for.
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},
);
