// Build a queue that runs both browsers and modules
// in parallel when the length reaches the concurrency limit
// and refills the queue when one promise resolves.

import chalk from "chalk";
import { getMaxSessions } from "./browserstack/api.js";
import { runWorker } from "./browserstack/workers.js";
import { getBrowserString } from "./lib/getBrowserString.js";
import { runSelenium } from "./selenium/runSelenium.js";

const queue = [];
const promises = [];

export function addRun( url, browser, options ) {
	queue.push( { url, browser, options } );
}

export async function runAll( { browserstack, concurrency } ) {
	while ( queue.length ) {
		const { url, browser, options } = queue.shift();

		const fullBrowser = getBrowserString( browser, options.headless );
		console.log(
			`\nRunning ${ chalk.yellow( options.modules.join( ", " ) ) } tests ` +
				`in ${ chalk.yellow( fullBrowser ) } (${ chalk.bold( options.reportId ) })...`
		);

		// Wait a bit between starting workers
		// This helps avoid undici connect timeout errors
		await new Promise( ( resolve ) => setTimeout( resolve, 100 ) );

		const promise = browserstack ?
			runWorker( url, browser, options ) :
			runSelenium( url, browser, options );

		// Remove the promise from the list when it resolves
		promise.then( () => {
			const index = promises.indexOf( promise );
			if ( index !== -1 ) {
				promises.splice( index, 1 );
			}
		} );

		// Add the promise to the list
		promises.push( promise );

		// Keep checking max sessions for browserstack
		if (
			promises.length >=
			( browserstack ?
				Math.min( concurrency, await getMaxSessions() ) :
				concurrency )
		) {

			// Wait until at least one promise resolves
			await Promise.any( promises );
		}
	}

	await Promise.all( promises );
}
