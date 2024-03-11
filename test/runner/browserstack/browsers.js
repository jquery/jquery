import chalk from "chalk";
import { getBrowserString } from "../lib/getBrowserString.js";
import { createWorker, deleteWorker, getAvailableSessions } from "./api.js";

const workers = Object.create( null );

/**
 * Keys are browser strings
 * Structure of a worker:
 * {
 * 	 debug: boolean, // Stops the worker from being cleaned up when finished
 *   id: string,
 *   lastTouch: number, // The last time a request was received
 *   url: string,
 *   browser: object, // The browser object
 *   options: object // The options to create the worker
 * }
 */

// Acknowledge the worker within the time limit.
// BrowserStack can take much longer spinning up
// some browsers, such as iOS 15 Safari.
const ACKNOWLEDGE_INTERVAL = 1000;
const ACKNOWLEDGE_TIMEOUT = 60 * 1000 * 5;

const MAX_WORKER_RESTARTS = 5;

// No report after the time limit
// should refresh the worker
const RUN_WORKER_TIMEOUT = 60 * 1000 * 2;

const WORKER_WAIT_TIME = 30000;

export function touchBrowser( browser ) {
	const fullBrowser = getBrowserString( browser );
	const worker = workers[ fullBrowser ];
	if ( worker ) {
		worker.lastTouch = Date.now();
	}
}

async function waitForAck( worker, { fullBrowser, verbose } ) {
	delete worker.lastTouch;
	return new Promise( ( resolve, reject ) => {
		const interval = setInterval( () => {
			if ( worker.lastTouch ) {
				if ( verbose ) {
					console.log( `\n${ fullBrowser } acknowledged.` );
				}
				clearTimeout( timeout );
				clearInterval( interval );
				resolve();
			}
		}, ACKNOWLEDGE_INTERVAL );

		const timeout = setTimeout( () => {
			clearInterval( interval );
			reject(
				new Error(
					`${ fullBrowser } not acknowledged after ${
						ACKNOWLEDGE_TIMEOUT / 1000 / 60
					}min.`
				)
			);
		}, ACKNOWLEDGE_TIMEOUT );
	} );
}

async function restartWorker( worker ) {
	await cleanupWorker( worker, worker.options );
	await createBrowserWorker(
		worker.url,
		worker.browser,
		worker.options,
		worker.restarts + 1
	);
}

export async function restartBrowser( browser ) {
	const fullBrowser = getBrowserString( browser );
	const worker = workers[ fullBrowser ];
	if ( worker ) {
		await restartWorker( worker );
	}
}

async function ensureAcknowledged( worker ) {
	const fullBrowser = getBrowserString( worker.browser );
	const verbose = worker.options.verbose;
	try {
		await waitForAck( worker, { fullBrowser, verbose } );
		return worker;
	} catch ( error ) {
		console.error( error.message );
		await restartWorker( worker );
	}
}

export async function createBrowserWorker( url, browser, options, restarts = 0 ) {
	if ( restarts > MAX_WORKER_RESTARTS ) {
		throw new Error(
			`Reached the maximum number of restarts for ${ chalk.yellow(
				getBrowserString( browser )
			) }`
		);
	}
	const verbose = options.verbose;
	while ( ( await getAvailableSessions() ) <= 0 ) {
		if ( verbose ) {
			console.log( "\nWaiting for available sessions..." );
		}
		await new Promise( ( resolve ) => setTimeout( resolve, WORKER_WAIT_TIME ) );
	}

	const { debug, runId, tunnelId } = options;
	const fullBrowser = getBrowserString( browser );

	const worker = await createWorker( {
		...browser,
		url: encodeURI( url ),
		project: "jquery",
		build: `Run ${ runId }`,

		// This is the maximum timeout allowed
		// by BrowserStack. We do this because
		// we control the timeout in the runner.
		// See https://github.com/browserstack/api/blob/b324a6a5bc1b6052510d74e286b8e1c758c308a7/README.md#timeout300
		timeout: 1800,

		// Not documented in the API docs,
		// but required to make local testing work.
		// See https://www.browserstack.com/docs/automate/selenium/manage-multiple-connections#nodejs
		"browserstack.local": true,
		"browserstack.localIdentifier": tunnelId
	} );

	browser.debug = !!debug;
	worker.url = url;
	worker.browser = browser;
	worker.restarts = restarts;
	worker.options = options;
	touchBrowser( browser );
	workers[ fullBrowser ] = worker;

	// Wait for the worker to show up in the list
	// before returning it.
	return ensureAcknowledged( worker );
}

export async function setBrowserWorkerUrl( browser, url ) {
	const fullBrowser = getBrowserString( browser );
	const worker = workers[ fullBrowser ];
	if ( worker ) {
		worker.url = url;
	}
}

/**
 * Checks that all browsers have received
 * a response in the given amount of time.
 * If not, the worker is restarted.
 */
export async function checkLastTouches() {
	for ( const [ fullBrowser, worker ] of Object.entries( workers ) ) {
		if ( Date.now() - worker.lastTouch > RUN_WORKER_TIMEOUT ) {
			const options = worker.options;
			if ( options.verbose ) {
				console.log(
					`\nNo response from ${ chalk.yellow( fullBrowser ) } in ${
						RUN_WORKER_TIMEOUT / 1000 / 60
					}min.`
				);
			}
			await restartWorker( worker );
		}
	}
}

export async function cleanupWorker( worker, { verbose } ) {
	for ( const [ fullBrowser, w ] of Object.entries( workers ) ) {
		if ( w === worker ) {
			delete workers[ fullBrowser ];
			await deleteWorker( worker.id );
			if ( verbose ) {
				console.log( `\nStopped ${ fullBrowser }.` );
			}
			return;
		}
	}
}

export async function cleanupAllBrowsers( { verbose } ) {
	const workersRemaining = Object.values( workers );
	const numRemaining = workersRemaining.length;
	if ( numRemaining ) {
		try {
			await Promise.all(
				workersRemaining.map( ( worker ) => deleteWorker( worker.id ) )
			);
			if ( verbose ) {
				console.log(
					`Stopped ${ numRemaining } browser${ numRemaining > 1 ? "s" : "" }.`
				);
			}
		} catch ( error ) {

			// Log the error, but do not consider the test run failed
			console.error( error );
		}
	}
}
