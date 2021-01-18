module.exports = {
    env: {
       browser: true,
       node: true,
       es2020: true,
    },
    extends: ['airbnb-base'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 11,
    },
    rules: {
        "no-console": "off",
        "indent": "off",
        "operator-linebreak": "off",
        "max-len": "off",
        "quotes": "off",
        "quote-props": "off",
        "no-nested-ternary": "off",
        "import/prefer-default-export": "off",
        "no-underscore-dangle": "off",
        "no-confusing-arrow": "off",
        "no-use-before-define": "off",
        "arrow-body-style": "off",
    },
};
