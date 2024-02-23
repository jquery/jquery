import yargs from "yargs/yargs";
import { browsers } from "./browsers.js";
import { getPlan, listBrowsers, stopWorkers } from "./browserstack/api.js";
import { buildBrowserFromString } from "./browserstack/buildBrowserFromString.js";
import { modules } from "./modules.js";
import { run } from "./run.js";

const argv = yargs( process.argv.slice( 2 ) )
	.version( false )
	.command( {
		command: "[options]",
		describe: "Run jQuery tests in a browser"
	} )
	.option( "module", {
		alias: "m",
		type: "array",
		choices: modules,
		description:
			"Run tests for a specific module. " +
			"Pass multiple modules by repeating the option. " +
			"Defaults to all modules."
	} )
	.option( "browser", {
		alias: "b",
		type: "array",
		choices: browsers,
		description:
			"Run tests in a specific browser." +
			"Pass multiple browsers by repeating the option." +
			"If using BrowserStack, specify browsers using --browserstack." +
			"Only the basic module is supported on jsdom.",
		default: [ "chrome" ]
	} )
	.option( "headless", {
		alias: "h",
		type: "boolean",
		description:
			"Run tests in headless mode. Cannot be used with --debug or --browserstack.",
		conflicts: [ "debug", "browserstack" ]
	} )
	.option( "esm", {
		alias: "esmodules",
		type: "boolean",
		description: "Run tests using jQuery's source, which is written with ECMAScript Modules."
	} )
	.option( "concurrency", {
		alias: "c",
		type: "number",
		description:
			"Run tests in parallel in multiple browsers. " +
			"Defaults to 8 in normal mode. In browserstack mode, defaults to the maximum available under your BrowserStack plan."
	} )
	.option( "debug", {
		alias: "d",
		type: "boolean",
		description:
			"Leave the browser open for debugging. Cannot be used with --headless.",
		conflicts: [ "headless" ]
	} )
	.option( "verbose", {
		alias: "v",
		type: "boolean",
		description: "Log additional information."
	} )
	.option( "retries", {
		alias: "r",
		type: "number",
		description: "Number of times to retry failed tests.",
		default: 0
	} )
	.option( "no-isolate", {
		type: "boolean",
		description: "Run all modules in the same browser instance."
	} )
	.option( "browserstack", {
		type: "array",
		description:
			"Run tests in BrowserStack.\nRequires BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables.\n" +
			"The value can be empty for the default configuration, or a string in the format of\n" +
			"\"browser_[browserVersion | :device]_os_osVersion\" (see --list-browsers).\n" +
			"Pass multiple browsers by repeating the option. The --browser option is ignored when --browserstack has a value.\n" +
			"Otherwise, the --browser option will be used, with the latest version/device for that browser, on a matching OS."
	} )
	.option( "list-browsers", {
		type: "string",
		description:
			"List available BrowserStack browsers and exit.\n" +
			"Leave blank to view all browsers or pass " +
			"\"browser_[browserVersion | :device]_os_osVersion\" with each parameter " +
			"separated by an underscore to filter the list (any can be omitted).\n" +
			"Use a colon to indicate a device.\n" +
			"Examples: \"chrome__windows_10\", \"Mobile Safari\", \"Android Browser_:Google Pixel 8 Pro\".\n" +
			"Use quotes if spaces are necessary."
	} )
	.option( "stop-workers", {
		type: "boolean",
		description:
			"Stop all BrowserStack workers that may exist and exit. This can be useful if there was a problem and there are stray workers."
	} )
	.option( "browserstack-plan", {
		type: "boolean",
		description: "Show BrowserStack plan information and exit."
	} )
	.help().argv;

if ( typeof argv.listBrowsers === "string" ) {
	listBrowsers( buildBrowserFromString( argv.listBrowsers ) );
} else if ( argv.stopWorkers ) {
	stopWorkers();
} else if ( argv.browserstackPlan ) {
	console.log( await getPlan() );
} else {
	run( {
		...argv,
		browsers: argv.browser,
		modules: argv.module && argv.module.length ? argv.module : modules
	} );
}
