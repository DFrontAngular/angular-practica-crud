import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import eslintParserTs from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['node_modules', 'dist'],
    languageOptions: {
      parser: eslintParserTs,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintPluginTs.configs['recommended'].rules,
      ...prettierConfig.rules,
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
];
