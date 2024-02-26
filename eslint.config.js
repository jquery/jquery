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
			"test/data/json_obj.js"
		]
	},

	{
		files: [
			"eslint.config.js",
			"Gruntfile.js",
			"test/node_smoke_tests/**",
			"test/promises_aplus_adapters/**",
			"test/middleware-mockserver.js"
		],
		languageOptions: {
			globals: {
				...globals.node
			},
			sourceType: "commonjs"
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "global" ]
		}
	},

	{
		files: [
			"test/runner/**/*.js"
		],
		languageOptions: {
			globals: {
				...globals.node
			},
			sourceType: "module"
		},
		rules: {
			...jqueryConfig.rules
		}
	},

	{
		files: [ "test/runner/listeners.js" ],
		languageOptions: {
			sourceType: "script"
		}
	},

	// Source
	{
		files: [ "src/**" ],
		languageOptions: {

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
			"test/**"
		],
		ignores: [
			"test/data/jquery-3.7.1.js",
			"test/data/badcall.js",
			"test/data/badjson.js",
			"test/data/support/csp.js",
			"test/data/support/getComputedSupport.js",
			"test/data/core/jquery-iterability-transpiled.js"
		],
		languageOptions: {
			globals: {
				...globals.browser,
				require: false,
				Promise: false,
				Symbol: false,
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
				jQuery: true,
				sinon: true,
				amdDefined: true,
				fireNative: true,
				Globals: true,
				hasPHP: true,
				isLocal: true,
				supportjQuery: true,
				originaljQuery: true,
				$: true,
				original$: true,
				baseURL: true,
				externalHost: true
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "function" ],

			// See https://github.com/eslint/eslint/issues/2342
			"no-unused-vars": "off",

			// Too many errors
			"max-len": "off",
			camelcase: "off",
			"one-var": "off"
		}
	},

	{
		files: [
			"test/data/testrunner.js",
			"test/data/core/jquery-iterability-transpiled-es6.js"
		],
		languageOptions: {
			sourceType: "script"
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
			"test/node_smoke_tests/**",
			"test/promises_aplus_adapters/**",
			"test/middleware-mockserver.js"
		],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2021
			}
		},
		rules: {
			strict: [ "error", "global" ]
		}
	},

	{
		files: [
			"build/**",
			"test/data/testinit.js"
		],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2021
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "global" ]
		}
	},

	{
		files: [
			"build/**/*.js",
			"test/data/testinit.js"
		],
		languageOptions: {
			sourceType: "commonjs"
		}
	},

	{
		files: [
			"dist/jquery.js",
			"dist/jquery.slim.js"
		],

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2021,
				define: false,
				module: false,
				Symbol: false
			}
		},

		rules: {
			...jqueryConfig.rules,

			// That is okay for the built version
			"no-multiple-empty-lines": "off",

			// When custom compilation is used, the version string
			// can get large. Accept that in the built version.
			"max-len": "off",
			"one-var": "off"
		}
	}
];
