const path = require('path')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config({
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: path.join(__dirname, 'tsconfig.json')
    }
  },
  plugins: {
    '@react-three': require('@react-three/eslint-plugin'),
    '@typescript-eslint': tseslint.plugin,
    import: require('eslint-plugin-import'),
    react: require('eslint-plugin-react'),
    'sort-destructure-keys': require('eslint-plugin-sort-destructure-keys'),
    'sort-keys-fix': require('eslint-plugin-sort-keys-fix'),
    'typescript-sort-keys': require('eslint-plugin-typescript-sort-keys')
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-console': 'off',
    'no-empty': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-sequences': 'off',
    'no-shadow': 'off',
    'no-sparse-arrays': 'off',
    'no-void': 'off',
    'padding-line-between-statements': [
      'warn',
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
    'react/jsx-props-no-spreading': 0,
    'react/jsx-sort-props': 1,
    'react/no-array-index-key': 0,
    'react/no-danger': 0,
    'react/no-unknown-property': 0,
    'react/no-unused-prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'sort-keys-fix/sort-keys-fix': 'error'
  },
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': { typescript: { project: './tsconfig.json' } },
    react: { version: 'detect' }
  }
})
