import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/worker/**', '**/geometry/**'],
              message: 'app/ must not import worker/ or geometry/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/viewer/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/worker/**'],
              message: 'viewer/ must not import worker/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/geometry/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'three',
              message: 'geometry/ must remain pure math.',
            },
            {
              name: 'replicad',
              message: 'geometry/ must not import replicad.',
            },
          ],
          patterns: [
            {
              group: ['three/*', 'replicad/*'],
              message: 'geometry/ must remain pure math.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/worker/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/app/**', '!**/app/protocol'],
              message: 'worker communication contracts must go through app/protocol.ts.',
            },
          ],
        },
      ],
    },
  },
])
