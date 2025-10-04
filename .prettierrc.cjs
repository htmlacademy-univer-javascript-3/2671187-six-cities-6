module.exports = {
  // Основные настройки форматирования
  semi: true, // Точки с запятой в конце строк
  singleQuote: true, // Одинарные кавычки вместо двойных
  quoteProps: 'as-needed', // Кавычки вокруг свойств только когда нужно
  trailingComma: 'es5', // Запятые в конце объектов/массивов (ES5 совместимость)
  tabWidth: 2, // Размер отступа (2 пробела)
  useTabs: false, // Использовать пробелы вместо табов
  printWidth: 80, // Максимальная длина строки
  bracketSpacing: true, // Пробелы внутри фигурных скобок { foo }
  bracketSameLine: false, // Закрывающая скобка на новой строке
  arrowParens: 'avoid', // Скобки вокруг параметров стрелочных функций только когда нужно
  endOfLine: 'lf', // Unix стиль окончания строк
  jsxSingleQuote: true, // Одинарные кавычки в JSX

  // Настройки для TypeScript
  parser: 'typescript',

  // Настройки для React/JSX
  overrides: [
    {
      files: '*.tsx',
      options: {
        parser: 'typescript',
        jsxSingleQuote: true,
      },
    },
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.jsx',
      options: {
        parser: 'babel',
        jsxSingleQuote: true,
      },
    },
    {
      files: '*.js',
      options: {
        parser: 'babel',
      },
    },
  ],
};
