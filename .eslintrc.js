module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'prettier'
    ],
    rules: {
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        'lines-between-class-members': 'off',
        'no-useless-constructor': 'off',
        'import/export': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'no-use-before-define': 'off',
        'class-methods-use-this': 'off',
        'no-restricted-syntax': 'off',
        'no-unused-vars': 'off',
        'no-plusplus': 'off',
        'no-shadow': 'off',
        'no-useless-rename': 'off',
        'no-param-reassign': 'off',
        'no-empty-function': 'off',
        'max-classes-per-file': 'off',
        'no-continue': 'off',
        'dot-notation': 'off'
    },
};
