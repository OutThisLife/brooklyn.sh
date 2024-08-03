/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: ['plugin:react-hooks/recommended', 'airbnb-typescript-prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parserOptions: {
      project: 'tsconfig.json'
    },
    sourceType: 'module'
  },
  plugins: [
    'import',
    'sort-keys-fix',
    'typescript-sort-keys',
    'sort-destructure-keys'
  ],
  root: true,
  rules: {
    '@typescript-eslint/consistent-type-imports': 1,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-shadow': 1,
    'import/no-cycle': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'lines-between-class-members': 0,
    'no-console': 0,
    'no-empty': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-return-assign': 0,
    'no-shadow': 0,
    'no-sparse-arrays': 0,
    'no-void': 0,
    'padding-line-between-statements': [
      1,
      {
        blankLine: 'always',
        next: [
          'block-like',
          'block',
          'return',
          'if',
          'class',
          'continue',
          'debugger',
          'break',
          'multiline-const',
          'multiline-let'
        ],
        prev: '*'
      },
      {
        blankLine: 'always',
        next: '*',
        prev: [
          'case',
          'default',
          'multiline-const',
          'multiline-let',
          'multiline-block-like'
        ]
      },
      {
        blankLine: 'never',
        next: ['block', 'block-like'],
        prev: ['case', 'default']
      },
      {
        blankLine: 'always',
        next: ['block', 'block-like'],
        prev: ['block', 'block-like']
      },
      {
        blankLine: 'always',
        next: ['empty'],
        prev: 'export'
      },
      {
        blankLine: 'never',
        next: 'iife',
        prev: ['block', 'block-like', 'empty']
      }
    ],
    'prettier/prettier': 1,
    'react-hooks/exhaustive-deps': 0,
    'react-hooks/rules-of-hooks': 2,
    'react/function-component-definition': [
      2,
      { namedComponents: 'function-declaration' }
    ],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-sort-props': 2,
    'react/no-array-index-key': 0,
    'react/no-danger': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys-fix/sort-keys-fix': 2
  },
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': { typescript: { project: './tsconfig.json' } }
  }
}
