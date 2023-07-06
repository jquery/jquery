module.exports = {
	root: true,

	parserOptions: {
		ecmaVersion: 5,
		sourceType: "script"
	},

	globals: {
		define: false,
		module: true,
		Symbol: false
	},

	overrides: [
		{
			files: "jquery{,.slim}.min.js",

			parserOptions: {
				ecmaVersion: 5,
				sourceType: "script"
			}
		},

		{
			files: "jquery{,.slim}.js",
			extends: "../.eslintrc-browser.cjs",

			rules: {

				// That is okay for the built version
				"no-multiple-empty-lines": "off",

				// When custom compilation is used, the version string
				// can get large. Accept that in the built version.
				"max-len": "off",
				"one-var": "off"
			}
		},

		{
			files: ".eslintrc.cjs",
			extends: "../.eslintrc-node.cjs"
		}
	]
}
