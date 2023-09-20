import jqueryConfig from "eslint-config-jquery";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
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
			"Gruntfile.cjs",
			"test/node_smoke_tests/commonjs/**",
			"test/node_smoke_tests/module/**",
			"test/promises_aplus_adapters/**",
			"test/middleware-mockserver.cjs"
		],
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "global" ]
		}
	},

	// Source
	{
		files: [ "src/**" ],
		plugins: {
			import: importPlugin
		},
		languageOptions: {

			// The browser env is not enabled on purpose so that code takes
			// all browser-only globals from window instead of assuming
			// they're available as globals. This makes it possible to use
			// jQuery with tools like jsdom which provide a custom window
			// implementation.
			globals: {
				window: false
			}
		},
		rules: {
			...jqueryConfig.rules,
			"import/extensions": [ "error", "always" ],
			"import/no-cycle": "error",

			// TODO: Enable this rule when eslint-plugin-import supports
			// it when using flat config.
			// See https://github.com/import-js/eslint-plugin-import/issues/2556

			// "import/no-unused-modules": [
			// 	"error",
			// 	{
			// 		unusedExports: true,

			// 		// When run via WebStorm, the root path against which these paths
			// 		// are resolved is the path where this ESLint config file lies,
			// 		// i.e. `src`. When run via the command line, it's usually the root
			// 		// folder of the jQuery repository. This pattern intends to catch both.
			// 		// Note that we cannot specify two patterns here:
			// 		//     [ "src/*.js", "*.js" ]
			// 		// as they're analyzed individually and the rule crashes if a pattern
			// 		// cannot be matched.
			// 		ignoreExports: [ "{src/,}*.js" ]
			// 	}
			// ],
			indent: [
				"error",
				"tab",
				{
					outerIIFEBody: 0
				}
			],
			"one-var": [ "error", { var: "always" } ],
			strict: [ "error", "function" ]
		}
	},

	{
		files: [
			"src/wrapper.js",
			"src/wrapper-esm.js",
			"src/wrapper-factory.js",
			"src/wrapper-factory-esm.js"
		],
		languageOptions: {
			globals: {
				jQuery: false
			}
		},
		rules: {
			"no-unused-vars": "off",
			indent: [
				"error",
				"tab",
				{

					// This makes it so code within the wrapper is not indented.
					ignoredNodes: [
						"Program > FunctionDeclaration > *"
					]
				}
			]
		}
	},

	{
		files: [
			"src/wrapper.js",
			"src/wrapper-factory.js"
		],
		languageOptions: {
			sourceType: "script",
			globals: {
				module: false
			}
		}
	},

	{
		files: [ "src/wrapper.js" ],
		rules: {
			indent: [
				"error",
				"tab",
				{

					// This makes it so code within the wrapper is not indented.
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
			"test/data/jquery-1.9.1.js",
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
			"test/node_smoke_tests/commonjs/**",
			"test/node_smoke_tests/module/**",
			"test/promises_aplus_adapters/**",
			"test/middleware-mockserver.cjs"
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
			"test/data/testinit.js",
			"test/data/testinit-jsdom.js"
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
			"test/data/testinit.js",
			"test/data/testinit-jsdom.js"
		],
		languageOptions: {
			sourceType: "commonjs"
		}
	},

	{
		files: [
			"dist/jquery.js",
			"dist/jquery.slim.js",
			"dist/jquery.factory.js",
			"dist/jquery.factory.slim.js",
			"dist-module/jquery.module.js",
			"dist-module/jquery.slim.module.js",
			"dist-module/jquery.factory.module.js",
			"dist-module/jquery.factory.slim.module.js"
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
