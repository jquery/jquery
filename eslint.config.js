"use strict";

const jqueryConfig = require( "eslint-config-jquery" );
const globals = require( "globals" );

module.exports = [
	{

		// Only global ignores will bypass the parser
		// and avoid JS parsing errors
		// See https://github.com/eslint/eslint/discussions/17412
		ignores: [
			"external",
			"test/data/json_obj.js",
			"test/data/jquery-3.7.1.js"
		]
	},

	// Source
	{
		files: [ "src/**" ],
		languageOptions: {
			ecmaVersion: 2015,

			// The browser env is not enabled on purpose so that code takes
			// all browser-only globals from window instead of assuming
			// they're available as globals. This makes it possible to use
			// jQuery with tools like jsdom which provide a custom window
			// implementation.
			globals: {
				define: false,
				window: false
			},
			sourceType: "commonjs"
		},
		rules: {
			...jqueryConfig.rules,
			indent: [
				"error",
				"tab",
				{
					outerIIFEBody: 0,

					// Ignore the top level function defining an AMD module
					ignoredNodes: [
						"Program > ExpressionStatement > CallExpression > :last-child > *"
					]
				}
			],
			"no-implicit-globals": "error",
			"no-unused-vars": [
				"error",
				{ caughtErrorsIgnorePattern: "^e$" }
			],
			"one-var": [ "error", { var: "always" } ],
			strict: [ "error", "function" ]
		}
	},

	{
		files: [ "src/selector.js" ],
		rules: {
			indent: "off"
		}
	},

	{
		files: [ "src/wrapper.js" ],
		languageOptions: {
			globals: {
				jQuery: false,
				module: true
			},
			sourceType: "script"
		},
		rules: {
			"no-unused-vars": "off",
			indent: [
				"error",
				"tab",
				{

					// Unlike other codes, "wrapper.js" is implemented in UMD.
					// So it required a specific exception for jQuery's UMD
					// Code Style. This makes that indentation check is not
					// performed for 1 depth of outer FunctionExpressions
					ignoredNodes: [
						"Program > ExpressionStatement > CallExpression > :last-child > *"
					]
				}
			]
		}
	},

	{
		files: [ "src/exports/amd.js" ],
		languageOptions: {
			globals: {
				define: false
			}
		}
	},

	// Tests
	{
		files: [
			"test/*",
			"test/data/**",
			"test/integration/**",
			"test/unit/**"
		],
		ignores: [
			"test/data/badcall.js",
			"test/data/badjson.js",
			"test/data/support/csp.js",
			"test/data/support/getComputedSupport.js",
			"test/data/core/jquery-iterability-transpiled.js"
		],
		languageOptions: {
			ecmaVersion: 2015,
			sourceType: "script",
			globals: {
				...globals.browser,
				require: false,
				trustedTypes: false,
				QUnit: false,
				ajaxTest: false,
				testIframe: false,
				createDashboardXML: false,
				createWithFriesXML: false,
				createXMLFragment: false,
				includesModule: false,
				moduleTeardown: false,
				url: false,
				q: false,
				jQuery: false,
				$: false,
				sinon: false,
				amdDefined: false,
				fireNative: false,
				Globals: false,
				hasPHP: false,
				isLocal: false,
				supportjQuery: false,
				originaljQuery: false,
				original$: false,
				baseURL: false,
				externalHost: false
			}
		},
		rules: {
			...jqueryConfig.rules,

			"no-unused-vars": [
				"error",
				{ args: "after-used", argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^e$" }
			],

			// Too many errors
			"max-len": "off",
			camelcase: "off"
		}
	},

	{
		files: [
			"test/jquery.js"
		],
		languageOptions: {
			globals: {
				loadTests: false
			}
		}
	},

	{
		files: [
			"test/unit/core.js"
		],
		rules: {

			// Core has several cases where unused vars are expected
			"no-unused-vars": "off"
		}
	},

	{
		files: [
			"test/runner/**/*.js"
		],
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.node
			}
		},
		rules: {
			...jqueryConfig.rules,
			"no-implicit-globals": "error"
		}
	},

	{
		files: [
			"test/runner/listeners.js"
		],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
			globals: {
				...globals.browser,
				QUnit: false,
				Symbol: false
			}
		}
	},

	{
		files: [
			"test/data/testinit.js",
			"test/data/testrunner.js",
			"test/data/core/jquery-iterability-transpiled-es6.js"
		],
		languageOptions: {
			ecmaVersion: 2015,
			sourceType: "script",
			globals: {
				...globals.browser
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "function" ]
		}
	},

	{
		files: [
			"test/data/testinit.js"
		],
		rules: {
			strict: [ "error", "global" ]
		}
	},

	{
		files: [
			"test/unit/deferred.js"
		],
		rules: {

			// Deferred tests set strict mode for certain tests
			strict: "off"
		}
	},

	{
		files: [
			"build/**",
			"eslint.config.js",
			"test/node_smoke_tests/**",
			"test/bundler_smoke_tests/**/*",
			"test/promises_aplus_adapters/**",
			"test/middleware-mockserver.js"
		],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "commonjs",
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			...jqueryConfig.rules,
			"no-implicit-globals": "error",
			"no-unused-vars": [
				"error",
				{ caughtErrorsIgnorePattern: "^e$" }
			],
			strict: [ "error", "global" ]
		}
	},

	{
		files: [
			"**/*.mjs"
		],
		languageOptions: {
			sourceType: "module"
		}
	},

	{
		files: [
			"dist/jquery.js",
			"dist/jquery.slim.js"
		],
		languageOptions: {
			globals: {
				define: false,
				module: false,
				Symbol: false,
				window: false
			}
		},
		rules: {
			...jqueryConfig.rules,

			"no-implicit-globals": "error",

			// That is okay for the built version
			"no-multiple-empty-lines": "off",

			"no-unused-vars": [
				"error",
				{ caughtErrorsIgnorePattern: "^e$" }
			],

			// When custom compilation is used, the version string
			// can get large. Accept that in the built version.
			"max-len": "off",
			"one-var": "off"
		}
	},

	{
		files: [
			"dist/**"
		],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script"
		}
	}
];
