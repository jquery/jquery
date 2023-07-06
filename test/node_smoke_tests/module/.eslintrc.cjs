module.exports = {
	root: true,

	extends: "../../../.eslintrc-node.cjs",

	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module"
	},
	env: {
		es2022: true
	}
};
