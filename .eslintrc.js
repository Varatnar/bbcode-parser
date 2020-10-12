const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    rules: {
        'no-debugger': isDev ? 'warn' : 'error',
        'prettier/prettier': isDev ? 'warn' : 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
    },
    env: {
        node: true,
    },
};
