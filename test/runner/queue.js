import chalk from "chalk";
import { getBrowserString } from "./lib/getBrowserString.js";
import {
	checkLastTouches,
	createBrowserWorker,
	restartBrowser,
	setBrowserWorkerUrl
} from "./browsers.js";

const TEST_POLL_TIMEOUT = 1000;

const queue = [];

export function getNextBrowserTest( reportId ) {
	const index = queue.findIndex( ( test ) => test.id === reportId );
	if ( index === -1 ) {
		return;
	}

	// Remove the completed test from the queue
	const previousTest = queue[ index ];
	queue.splice( index, 1 );

	// Find the next test for the same browser
	for ( const test of queue.slice( index ) ) {
		if ( test.fullBrowser === previousTest.fullBrowser ) {

			// Set the URL for our tracking
			setBrowserWorkerUrl( test.browser, test.url );
			test.running = true;

			// Return the URL for the next test.
			// listeners.js will use this to set the browser URL.
			return { url: test.url };
		}
	}
}

export function retryTest( reportId, maxRetries ) {
	if ( !maxRetries ) {
		return;
	}
	const test = queue.find( ( test ) => test.id === reportId );
	if ( test ) {
		test.retries++;
		if ( test.retries <= maxRetries ) {
			console.log(
				`\nRetrying test ${ reportId } for ${ chalk.yellow(
					test.options.modules.join( ", " )
				) }...${ test.retries }`
			);
			return test;
		}
	}
}

export async function hardRetryTest( reportId, maxHardRetries ) {
	if ( !maxHardRetries ) {
		return false;
	}
	const test = queue.find( ( test ) => test.id === reportId );
	if ( test ) {
		test.hardRetries++;
		if ( test.hardRetries <= maxHardRetries ) {
			console.log(
				`\nHard retrying test ${ reportId } for ${ chalk.yellow(
					test.options.modules.join( ", " )
				) }...${ test.hardRetries }`
			);
			await restartBrowser( test.browser );
			return true;
		}
	}
	return false;
}

export function addRun( url, browser, options ) {
	queue.push( {
		browser,
		fullBrowser: getBrowserString( browser ),
		hardRetries: 0,
		id: options.reportId,
		url,
		options,
		retries: 0,
		running: false
	} );
}

export async function runAll() {
	return new Promise( async( resolve, reject ) => {
		while ( queue.length ) {
			try {
				await checkLastTouches();
			} catch ( error ) {
				reject( error );
			}

			// Run one test URL per browser at a time
			const browsersTaken = [];
			for ( const test of queue ) {
				if ( browsersTaken.indexOf( test.fullBrowser ) > -1 ) {
					continue;
				}
				browsersTaken.push( test.fullBrowser );
				if ( !test.running ) {
					test.running = true;
					try {
						await createBrowserWorker( test.url, test.browser, test.options );
					} catch ( error ) {
						reject( error );
					}
				}
			}
			await new Promise( ( resolve ) => setTimeout( resolve, TEST_POLL_TIMEOUT ) );
		}
		resolve();
	} );
}
