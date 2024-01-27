import chalk from "chalk";
import { asyncExitHook, gracefulExit } from "exit-hook";
import { getLatestBrowser, getMaxSessions } from "./browserstack/api.js";
import { buildBrowserFromString } from "./browserstack/buildBrowserFromString.js";
import { localTunnel } from "./browserstack/local.js";
import { reportEnd, reportTest } from "./browserstack/reporter.js";
import {
	cleanupAllWorkers,
	cleanupWorker,
	debugWorker,
	retryTest,
	touchWorker
} from "./browserstack/workers.js";
import { createTestServer } from "./createTestServer.js";
import { buildTestUrl } from "./lib/buildTestUrl.js";
import { generateHash, printModuleHashes } from "./lib/generateHash.js";
import { getBrowserString } from "./lib/getBrowserString.js";
import { addRun, runFullQueue } from "./queue.js";

/**
 * Run modules in parallel in different browser instances.
 */
export async function run( {
	browsers,
	browserstack,
	concurrency,
	debug,
	headless,
	isolate = true,
	modules = [],
	retries = 3,
	verbose
} = {} ) {
	if ( !browsers || !browsers.length ) {
		browsers = [ "chrome" ];
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

	// Convert browsers to browser objects
	browsers = browsers.map( ( b ) => ( { browser: b } ) );

	// A unique identifier for this run
	const runId = generateHash(
		`${ Date.now() }-${ modules.join( ":" ) }`,
		browsers.join( ":" )
	);

	// Create the test app and
	// hook it up to the reporter
	const reports = {};
	const app = await createTestServer( async( message ) => {
		switch ( message.type ) {
			case "testEnd":
				touchWorker( message.id );
				const errors = reportTest(
					message.data,
					message.id,
					reports[ message.id ]
				);
				if ( errors ) {
					pendingErrors[ message.id ] ||= {};
					pendingErrors[ message.id ].errors = errors;
				}
				break;
			case "runEnd": {
				const failedCount = reportEnd(
					message.data,
					message.id,
					reports[ message.id ]
				);

				if ( !failedCount ) {
					if ( pendingErrors[ message.id ] ) {
						console.warn( "Detected flaky tests:" );
						console.warn(
							chalk.italic( chalk.gray( pendingErrors[ message.id ].errors ) )
						);
						delete pendingErrors[ message.id ];
					}
					await cleanupWorker( message.id, verbose );
				} else if ( debug ) {
					debugWorker( message.id );
				} else if ( failedCount ) {
					if ( !retryTest( message.id, retries ) ) {
						errorMessages.push( pendingErrors[ message.id ].errors );
						await cleanupWorker( message.id, verbose );
					}
				}
				break;
			}
			case "ack": {
				touchWorker( message.id );
				if ( verbose ) {
					console.log( `\nWorker for test ${ message.id } acknowledged.` );
				}
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

		if ( tunnel ) {
			await tunnel.stop();
			if ( verbose ) {
				console.log( "Stopped BrowserStackLocal." );
			}
		}

		await cleanupAllWorkers( verbose );
	}

	asyncExitHook(
		async() => {
			await stopServer();
			await cleanup();
		},
		{ wait: 60000 }
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

		// Convert browserstack to browser objects
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
					throw new Error( `Browser not found: ${ getBrowserString( browser ) }.` );
				}
				return latestMatch;
			} )
		);

		tunnel = await localTunnel( runId );
		if ( verbose ) {
			console.log( "Started BrowserStackLocal." );

			printModuleHashes( modules );
		}
	}

	function queueRun( modules, browser ) {
		const fullBrowser = getBrowserString( browser, headless );
		const reportId = generateHash( modules.join( ":" ), fullBrowser );
		reports[ reportId ] = { browser, headless, modules };

		const url = buildTestUrl( modules, { browserstack, port, reportId } );

		addRun( url, browser, {
			debug,
			headless,
			modules,
			reportId,
			retries,
			runId,
			verbose
		} );
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
		await runFullQueue( { browserstack, concurrency, verbose } );
	} catch ( error ) {
		if ( !debug ) {
			throw error;
		} else {
			console.error( error );
		}
	} finally {
		console.log();
		if ( errorMessages.length === 0 ) {
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
				console.log( "Leaving browsers with failures open for debugging." );
				console.log( "View at https://automate.browserstack.com/dashboard/v2/" );
				console.log( "Press Ctrl+C to exit." );
			} else {
				gracefulExit( 1 );
			}
		}
	}
}
