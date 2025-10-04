/* eslint-env node */

module.exports = {
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'htmlacademy/react-typescript',
    'prettier', // Добавляем prettier в конец для отключения конфликтующих правил
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh', 'prettier'], // Добавляем prettier плагин
  rules: {
    'react-refresh/only-export-components': 'warn',
    'prettier/prettier': 'error', // Ошибки при несоответствии prettier правилам
  },
  overrides: [
    {
      files: ['*test*'],
      rules: { '@typescript-eslint/unbound-method': 'off' },
    },
  ],
};
