import babelParser from '@babel/eslint-parser';

// Parse TypeScript without coupling linting to the TypeScript compiler version.
// Correctness rules avoid an unrelated repository-wide stylistic rewrite.
export default [{
  ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'],
}, {
  files: ['**/*.{js,mjs,ts,tsx}'],
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: { presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-syntax-jsx'] },
    },
  },
  rules: {
    'no-debugger': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-duplicate-case': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-async-promise-executor': 'error',
  },
}];
