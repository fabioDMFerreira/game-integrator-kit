module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
        "css-modules"
    ],
    "rules": {
        "indent": [1, "tab"],
        "no-tabs": 0,
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
        "react/jsx-indent": [1, "tab"],
        "react/jsx-indent-props": [1, 0],
        "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["registration"] }],
        "one-var": ["error", "always"]
    },
    "globals": {
        "document": true,
        "window": true,
        "it": true,
        "navigator": true,
        "fetch": true
    }
};