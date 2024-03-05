// Build a queue that runs both browsers and modules
// in parallel when the length reaches the concurrency limit
// and refills the queue when one promise resolves.

import chalk from "chalk";
import { getBrowserString } from "../lib/getBrowserString.js";
import { runSelenium } from "./runSelenium.js";
import { runJSDOM } from "../jsdom.js";

const promises = [];
const queue = [];

const SELENIUM_WAIT_TIME = 100;

// Limit concurrency to 8 by default in selenium
// BrowserStack defaults to the max allowed by the plan
// More than this will log MaxListenersExceededWarning
const MAX_CONCURRENCY = 8;

export function addSeleniumRun( url, browser, options ) {
	queue.push( { url, browser, options } );
}

export async function runAllSelenium( { concurrency = MAX_CONCURRENCY, verbose } ) {
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
		await new Promise( ( resolve ) => setTimeout( resolve, SELENIUM_WAIT_TIME ) );

		if ( verbose ) {
			console.log( `\nTests remaining: ${ queue.length + 1 }.` );
		}

		let promise;
		if ( browser.browser === "jsdom" ) {
			promise = runJSDOM( url, options );
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
