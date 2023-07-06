"use strict";

module.exports = {
	root: true,

	extends: "../../../.eslintrc-node.cjs",

	parserOptions: {
		ecmaVersion: 2015,
		sourceType: "script"
	},
	env: {
		es2022: true
	}
};
