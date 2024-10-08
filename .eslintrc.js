/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  env: { node: true },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    emitDecoratorMetadata: true,
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'func-style': ['error', 'expression'],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['libs/*'],
            message: 'Please import with path alias like `@libs/*`'
          }
        ]
      }
    ],
    'object-shorthand': ['warn', 'always']
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          },
          {
            selector: 'import',
            format: ['camelCase', 'PascalCase']
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          },
          {
            selector: 'typeLike',
            format: ['PascalCase']
          },
          {
            selector: ['objectLiteralProperty', 'classProperty'],
            format: ['camelCase', 'PascalCase']
          },
          {
            selector: ['enum', 'enumMember'],
            format: ['PascalCase']
          }
        ]
      }
    }
  ]
}
