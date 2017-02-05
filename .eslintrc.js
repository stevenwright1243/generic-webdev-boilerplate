module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import",
        "eslint-plugin-babel",
        "eslint-plugin-flowtype"
    ],
    "parser": "babel-eslint",
    "ecmaVersion": 8,
    "env": {
    "browser": true,
    "node": true
  },
    "rules": {
      "linebreak-style": "off", // Windows uses CRLF while unix (mac/linux) use LF, shouldn't be an issue
      "no-undef" : "off", // Current build process doesn't think this, nor the 2 below are correct but they are
      "quote-props" : "off",
      "no-unused-vars" : "off",
      "import/no-extraneous-dependencies" : "off"
    }
};
