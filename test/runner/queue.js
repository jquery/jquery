// Build a queue that runs both browsers and modules
// in parallel when the length reaches the concurrency limit
// and refills the queue when one promise resolves.

import chalk from "chalk";
import { getAvailableSessions } from "./browserstack/api.js";
import { runWorker } from "./browserstack/workers.js";
import { getBrowserString } from "./lib/getBrowserString.js";
import { runSelenium } from "./selenium/runSelenium.js";
import { runJSDOM } from "./jsdom.js";

const queue = [];
const promises = [];

const SELENIUM_WAIT_TIME = 100;
const BROWSERSTACK_WAIT_TIME = 5000;
const WORKER_WAIT_TIME = 30000;

// Limit concurrency to 8 by default in selenium
// BrowserStack defaults to the max allowed by the plan
// More than this will log MaxListenersExceededWarning
const MAX_CONCURRENCY = 8;

export function addRun( url, browser, options ) {
	queue.push( { url, browser, options } );
}

export async function runFullQueue( {
	browserstack,
	concurrency: defaultConcurrency,
	verbose
} ) {
	while ( queue.length ) {
		const next = queue.shift();
		const { url, browser, options } = next;

		const fullBrowser = getBrowserString( browser, options.headless );
		console.log(
			`\nRunning ${ chalk.yellow( options.modules.join( ", " ) ) } tests ` +
				`in ${ chalk.yellow( fullBrowser ) } (${ chalk.bold( options.reportId ) })...`
		);

		// Wait enough time between requests
		// to give concurrency a chance to update.
		// In selenium, this helps avoid undici connect timeout errors.
		await new Promise( ( resolve ) =>
			setTimeout(
				resolve,
				browserstack ? BROWSERSTACK_WAIT_TIME : SELENIUM_WAIT_TIME
			)
		);

		const concurrency =
			browserstack && !defaultConcurrency ?
				await getAvailableSessions() :
				defaultConcurrency || MAX_CONCURRENCY;

		if ( verbose ) {
			console.log(
				`\nConcurrency: ${ concurrency }. Tests remaining: ${ queue.length + 1 }.`
			);
		}

		// If concurrency is 0, wait a bit and try again
		if ( concurrency <= 0 ) {
			if ( verbose ) {
				console.log( "\nWaiting for available sessions..." );
			}
			queue.unshift( next );
			await new Promise( ( resolve ) => setTimeout( resolve, WORKER_WAIT_TIME ) );
			continue;
		}

		let promise;
		if ( browser.browser === "jsdom" ) {
			promise = runJSDOM( url, options );
		} else if ( browserstack ) {
			promise = runWorker( url, browser, options );
		} else {
			promise = runSelenium( url, browser, options );
		}

		// Remove the promise from the list when it resolves
		promise.then( () => {
			const index = promises.indexOf( promise );
			if ( index !== -1 ) {
				promises.splice( index, 1 );
			}
		} );

		// Add the promise to the list
		promises.push( promise );

		// Wait until at least one promise resolves
		// if we've reached the concurrency limit
		if ( promises.length >= concurrency ) {
			await Promise.any( promises );
		}
	}

	await Promise.all( promises );
}
