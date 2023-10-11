module.exports = {
    parser: 'vue-eslint-parser',
    plugins: ['@typescript-eslint'],
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
    },
    rules: {
        // 禁止使用 var
        'no-var': 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // 允许this使用_线开头
        'no-underscore-dangle': [2, { allowAfterThis: true}],
        // 'max-len': [2, { code: 180 }],
        'max-len': [2, { code: 600 }],
        '@typescript-eslint/no-var-requires': 0,
        // 'prettier/prettier': [
        //     'error',
        //     {
        //         tabWidth: 4,
        //         singleQuote: true,
        //         printWidth: 180,
        //     },
        // ],
        '@typescript-eslint/no-explicit-any': ['off'],
        'prettier/prettier': 'off',
        'quotes': ['error', 'single'],
        'quote-props': ['error', 'as-needed', { unnecessary: false }],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-this-alias': ['off']
    },
};
