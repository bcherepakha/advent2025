/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es2023: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      files: ["public/**/*.js"],
      env: {
        browser: true,
        node: false
      }
    }
  ],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-undef": "error",
    "no-console": "off",
    "prefer-const": "warn"
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "coverage/",
    // на всякий случай, если потом появятся сборки
    "public/build/",
    "public/assets/"
  ]
};
