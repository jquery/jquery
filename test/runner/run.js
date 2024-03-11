import chalk from "chalk";
import { asyncExitHook, gracefulExit } from "exit-hook";
import { getLatestBrowser } from "./browserstack/api.js";
import { buildBrowserFromString } from "./browserstack/buildBrowserFromString.js";
import { localTunnel } from "./browserstack/local.js";
import { reportEnd, reportTest } from "./reporter.js";
import { createTestServer } from "./createTestServer.js";
import { buildTestUrl } from "./lib/buildTestUrl.js";
import { generateHash, printModuleHashes } from "./lib/generateHash.js";
import { getBrowserString } from "./lib/getBrowserString.js";
import { cleanupAllJSDOM, cleanupJSDOM } from "./jsdom.js";
import { modules as allModules } from "./modules.js";
import { cleanupAllBrowsers, touchBrowser } from "./browserstack/browsers.js";
import {
	addBrowserStackRun,
	getNextBrowserTest,
	hardRetryTest,
	retryTest,
	runAllBrowserStack
} from "./browserstack/queue.js";
import { addSeleniumRun, runAllSelenium } from "./selenium/queue.js";

const EXIT_HOOK_WAIT_TIMEOUT = 60 * 1000;

/**
 * Run modules in parallel in different browser instances.
 */
export async function run( {
	browsers: browserNames,
	browserstack,
	concurrency,
	debug,
	esm,
	hardRetries,
	headless,
	isolate,
	modules = [],
	retries = 0,
	runId,
	verbose
} ) {
	if ( !browserNames || !browserNames.length ) {
		browserNames = [ "chrome" ];
	}
	if ( !modules.length ) {
		modules = allModules;
	}
	if ( headless && debug ) {
		throw new Error(
			"Cannot run in headless mode and debug mode at the same time."
		);
	}

	if ( verbose ) {
		console.log( browserstack ? "Running in BrowserStack." : "Running locally." );
	}

	const errorMessages = [];
	const pendingErrors = {};

	// Convert browser names to browser objects
	let browsers = browserNames.map( ( b ) => ( { browser: b } ) );
	const tunnelId = generateHash(
		`${ Date.now() }-${ modules.join( ":" ) }-${ ( browserstack || [] )
			.concat( browserNames )
			.join( ":" ) }`
	);

	// A unique identifier for this run
	if ( !runId ) {
		runId = tunnelId;
	}

	// Create the test app and
	// hook it up to the reporter
	const reports = Object.create( null );
	const app = await createTestServer( async( message ) => {
		switch ( message.type ) {
			case "testEnd": {
				const reportId = message.id;
				const report = reports[ reportId ];
				touchBrowser( report.browser );
				const errors = reportTest( message.data, reportId, report );
				pendingErrors[ reportId ] ??= Object.create( null );
				if ( errors ) {
					pendingErrors[ reportId ][ message.data.name ] = errors;
				} else {
					const existing = pendingErrors[ reportId ][ message.data.name ];

					// Show a message for flakey tests
					if ( existing ) {
						console.log();
						console.warn(
							chalk.italic(
								chalk.gray( existing.replace( "Test failed", "Test flakey" ) )
							)
						);
						console.log();
						delete pendingErrors[ reportId ][ message.data.name ];
					}
				}
				break;
			}
			case "runEnd": {
				const reportId = message.id;
				const report = reports[ reportId ];
				touchBrowser( report.browser );
				const { failed, total } = reportEnd(
					message.data,
					message.id,
					reports[ reportId ]
				);
				report.total = total;

				cleanupJSDOM( reportId, { verbose } );

				// Handle failure
				if ( failed ) {
					const retry = retryTest( reportId, retries );

					// Retry if retryTest returns a test
					if ( retry ) {
						return retry;
					}

					// Return early if hardRetryTest returns true
					if ( await hardRetryTest( reportId, hardRetries ) ) {
						return;
					}
					errorMessages.push( ...Object.values( pendingErrors[ reportId ] ) );
				}

				// Run the next test
				return getNextBrowserTest( reportId );
			}
			case "ack": {
				const report = reports[ message.id ];
				touchBrowser( report.browser );
				break;
			}
			default:
				console.warn( "Received unknown message type:", message.type );
		}
	} );

	// Start up local test server
	let server;
	let port;
	await new Promise( ( resolve ) => {

		// Pass 0 to choose a random, unused port
		server = app.listen( 0, () => {
			port = server.address().port;
			resolve();
		} );
	} );

	if ( !server || !port ) {
		throw new Error( "Server not started." );
	}

	if ( verbose ) {
		console.log( `Server started on port ${ port }.` );
	}

	function stopServer() {
		return new Promise( ( resolve ) => {
			server.close( () => {
				if ( verbose ) {
					console.log( "Server stopped." );
				}
				resolve();
			} );
		} );
	}

	async function cleanup() {
		console.log( "Cleaning up..." );

		await cleanupAllBrowsers( { verbose } );
		cleanupAllJSDOM( { verbose } );

		if ( tunnel ) {
			await tunnel.stop();
			if ( verbose ) {
				console.log( "Stopped BrowserStackLocal." );
			}
		}
	}

	asyncExitHook(
		async() => {
			await cleanup();
			await stopServer();
		},
		{ wait: EXIT_HOOK_WAIT_TIMEOUT }
	);

	// Start up BrowserStackLocal
	let tunnel;
	if ( browserstack ) {
		if ( headless ) {
			console.warn(
				chalk.italic(
					"BrowserStack does not support headless mode. Running in normal mode."
				)
			);
			headless = false;
		}

		// Convert browserstack to browser objects.
		// If browserstack is an empty array, fall back
		// to the browsers array.
		if ( browserstack.length ) {
			browsers = browserstack.map( ( b ) => {
				if ( !b ) {
					return browsers[ 0 ];
				}
				return buildBrowserFromString( b );
			} );
		}

		// Fill out browser defaults
		browsers = await Promise.all(
			browsers.map( async( browser ) => {

				// Avoid undici connect timeout errors
				await new Promise( ( resolve ) => setTimeout( resolve, 100 ) );

				const latestMatch = await getLatestBrowser( browser );
				if ( !latestMatch ) {
					console.error(
						chalk.red( `Browser not found: ${ getBrowserString( browser ) }.` )
					);
					gracefulExit( 1 );
				}
				return latestMatch;
			} )
		);

		tunnel = await localTunnel( tunnelId );
		if ( verbose ) {
			console.log( "Started BrowserStackLocal." );

			printModuleHashes( modules );
		}
	}

	function queueRun( modules, browser ) {
		const fullBrowser = getBrowserString( browser, headless );
		const reportId = generateHash( `${ modules.join( ":" ) } ${ fullBrowser }` );
		reports[ reportId ] = { browser, headless, modules };

		const url = buildTestUrl( modules, {
			browserstack,
			esm,
			jsdom: browser.browser === "jsdom",
			port,
			reportId
		} );

		const options = {
			debug,
			headless,
			modules,
			reportId,
			runId,
			tunnelId,
			verbose
		};

		if ( browserstack ) {
			addBrowserStackRun( url, browser, options );
		} else {
			addSeleniumRun( url, browser, options );
		}
	}

	for ( const browser of browsers ) {
		if ( isolate ) {
			for ( const module of modules ) {
				queueRun( [ module ], browser );
			}
		} else {
			queueRun( modules, browser );
		}
	}

	try {
		console.log( `Starting Run ${ runId }...` );
		if ( browserstack ) {
			await runAllBrowserStack( { verbose } );
		} else {
			await runAllSelenium( { concurrency, verbose } );
		}
	} catch ( error ) {
		console.error( error );
		if ( !debug ) {
			gracefulExit( 1 );
		}
	} finally {
		console.log();
		if ( errorMessages.length === 0 ) {
			let stop = false;
			for ( const report of Object.values( reports ) ) {
				if ( !report.total ) {
					stop = true;
					console.error(
						chalk.red(
							`No tests were run for ${ report.modules.join(
								", "
							) } in ${ getBrowserString( report.browser ) }`
						)
					);
				}
			}
			if ( stop ) {
				return gracefulExit( 1 );
			}
			console.log( chalk.green( "All tests passed!" ) );

			if ( !debug || browserstack ) {
				gracefulExit( 0 );
			}
		} else {
			console.error( chalk.red( `${ errorMessages.length } tests failed.` ) );
			console.log(
				errorMessages.map( ( error, i ) => `\n${ i + 1 }. ${ error }` ).join( "\n" )
			);

			if ( debug ) {
				console.log();
				if ( browserstack ) {
					console.log( "Leaving browsers with failures open for debugging." );
					console.log(
						"View running sessions at https://automate.browserstack.com/dashboard/v2/"
					);
				} else {
					console.log( "Leaving browsers open for debugging." );
				}
				console.log( "Press Ctrl+C to exit." );
			} else {
				gracefulExit( 1 );
			}
		}
	}
}
