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
			"tmp",
			"test/data/json_obj.js",
			"test/data/jquery-*.js"
		]
	},

	// Source
	{
		files: [ "src/**" ],
		plugins: {
			import: importPlugin
		},
		languageOptions: {
			ecmaVersion: 2015,

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
			indent: [ "error", "tab" ],
			"no-implicit-globals": "error",
			"no-unused-vars": [
				"error",
				{ caughtErrorsIgnorePattern: "^_" }
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
			ecmaVersion: 5,
			sourceType: "script",
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
				{ args: "after-used", argsIgnorePattern: "^_" }
			],

			// Too many errors
			"max-len": "off",
			camelcase: "off"
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
			...jqueryConfig.rules
		}
	},

	{
		files: [ "test/runner/listeners.js" ],
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
			"eslint.config.js",
			".release-it.cjs",
			"build/**",
			"test/node_smoke_tests/**",
			"test/bundler_smoke_tests/**/*",
			"test/promises_aplus_adapters/**",
			"test/middleware-mockserver.cjs"
		],
		languageOptions: {
			ecmaVersion: "latest",
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
				{ caughtErrorsIgnorePattern: "^_" }
			],
			strict: [ "error", "global" ]
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
			"dist-module/jquery.factory.slim.module.js",
			"dist/wrappers/*.js",
			"dist-module/wrappers/*.js"
		],
		languageOptions: {
			ecmaVersion: 2015,
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
				{ caughtErrorsIgnorePattern: "^_" }
			],

			// When custom compilation is used, the version string
			// can get large. Accept that in the built version.
			"max-len": "off",
			"one-var": "off"
		}
	},

	{
		files: [
			"dist/jquery.slim.js",
			"dist/jquery.factory.slim.js",
			"dist-module/jquery.slim.module.js",
			"dist-module/jquery.factory.slim.module.js"
		],
		rules: {

			// Rollup is now smart enough to remove the use
			// of parameters if the argument is not passed
			// anywhere in the build.
			// The removal of effects in the slim build
			// results in some parameters not being used,
			// which can be safely ignored.
			"no-unused-vars": [
				"error",
				{ args: "none" }
			]
		}
	},

	{
		files: [
			"src/wrapper.js",
			"src/wrapper-factory.js",
			"dist/jquery.factory.js",
			"dist/jquery.factory.slim.js",
			"test/middleware-mockserver.cjs"
		],
		rules: {
			"no-implicit-globals": "off"
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
	},

	{
		files: [
			"dist-module/**"
		],
		languageOptions: {
			ecmaVersion: 2015,
			sourceType: "module"
		}
	},

	{
		files: [
			"dist/wrappers/*.js"
		],
		languageOptions: {
			ecmaVersion: 2015,
			sourceType: "commonjs"
		}
	}
];
