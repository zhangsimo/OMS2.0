module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
   // allow async-await
   'generator-star-spacing': 'off',
   // allow debugger during development
   'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
   'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
   'no-undef': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
