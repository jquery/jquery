import chalk from "chalk";
import { getBrowserString } from "../lib/getBrowserString.js";
import { changeUrl, createWorker, deleteWorker, getWorker } from "./api.js";

const workers = {};

// Acknowledge the worker within 2min
const ACKNOWLEDGE_WORKER_TIMEOUT = 60 * 1000 * 2;
const ACKNOWLEDGE_WORKER_INTERVAL = 1000;

// No report after 2min
// should refresh the worker
const RUN_WORKER_TIMEOUT = 60 * 1000 * 2;
const MAX_WORKER_RETRIES = 5;
const MAX_WORKER_REFRESHES = 2;
const POLL_WORKER_TIMEOUT = 1000;

export async function cleanupWorker( reportId, verbose ) {
	const worker = workers[ reportId ];
	if ( worker ) {
		try {
			delete workers[ reportId ];
			await deleteWorker( worker.id, verbose );
		} catch ( error ) {
			console.error( error );
		}
	}
}

export function touchWorker( reportId ) {
	const worker = workers[ reportId ];
	if ( worker ) {
		worker.lastTouch = Date.now();
	}
}

export function acknowledgeWorker( reportId ) {
	touchWorker( reportId );
	const worker = workers[ reportId ];
	if ( worker ) {
		worker.ack = true;
	}
}

export async function cleanupAllWorkers( verbose ) {
	const workersRemaining = Object.keys( workers ).length;
	if ( workersRemaining ) {
		if ( verbose ) {
			console.log(
				`Stopping ${ workersRemaining } stray worker${
					workersRemaining > 1 ? "s" : ""
				}...`
			);
		}
		await Promise.all(
			Object.values( workers ).map( ( worker ) => deleteWorker( worker.id, verbose ) )
		);
	}
}

async function waitForAck( id, verbose ) {
	return new Promise( ( resolve, reject ) => {
		const interval = setInterval( () => {
			const worker = workers[ id ];
			if ( !worker ) {
				clearInterval( interval );
				return reject( new Error( `Worker ${ id } not found.` ) );
			}
			if ( worker.ack ) {
				if ( verbose ) {
					console.log( `\nWorker ${ id } acknowledged.` );
				}
				clearInterval( interval );
				resolve();
			}
		}, ACKNOWLEDGE_WORKER_INTERVAL );
		setTimeout( () => {
			clearInterval( interval );
			reject(
				new Error(
					`Worker ${ id } not acknowledged after ${
						ACKNOWLEDGE_WORKER_TIMEOUT / 1000
					}s.`
				)
			);
		}, ACKNOWLEDGE_WORKER_TIMEOUT );
	} );
}

/**
 * All arguments are required or the request will fail
 */
export async function runWorker(
	url,
	browser,
	{ reportId, runId, verbose },
	retries = 0
) {
	const worker = await createWorker( {
		...browser,
		url: encodeURI( url ),
		project: "jquery",
		build: `Run ${ runId }`,
		name: `Test ${ reportId }`,

		// Set the max here, so that we can
		// control the timeout
		timeout: 1800,

		// Not documented in the API docs,
		// but required to make local testing work.
		// See https://www.browserstack.com/docs/automate/selenium/manage-multiple-connections#nodejs
		"browserstack.local": true,
		"browserstack.localIdentifier": runId
	} );

	workers[ reportId ] = worker;

	const timeMessage = `\nWorker ${
		worker.id
	} created for test ${ reportId } (${ chalk.yellow( getBrowserString( browser ) ) })`;

	if ( verbose ) {
		console.time( timeMessage );
	}

	async function retryWorker() {
		await cleanupWorker( reportId, verbose );
		if ( verbose ) {
			console.log(
				`Worker ${ worker.id } not acknowledged after ${
					ACKNOWLEDGE_WORKER_TIMEOUT / 1000
				}s.`
			);
			console.log( `Retrying worker for test ${ reportId }...${ retries + 1 }` );
		}
		return runWorker( url, browser, { reportId, runId, verbose }, retries + 1 );
	}

	// Wait for the worker to be acknowledged
	try {
		await waitForAck( reportId );
	} catch ( error ) {
		if ( !workers[ reportId ] ) {

			// The worker has already been cleaned up
			return;
		}

		if ( retries < MAX_WORKER_RETRIES ) {
			return retryWorker();
		}

		throw error;
	}

	if ( verbose ) {
		console.timeEnd( timeMessage );
	}

	let refreshes = 0;
	let loggedStarted = false;
	return new Promise( ( resolve, reject ) => {
		const interval = setInterval( async() => {
			const worker = workers[ reportId ];

			if ( !worker ) {
				clearInterval( interval );
				return resolve();
			}

			const fetchedWorker = await getWorker( worker.id );
			if ( !fetchedWorker || ( fetchedWorker.status !== "running" && fetchedWorker.status !== "queue" ) ) {
				clearInterval( interval );
				return resolve();
			}

			if ( verbose && !loggedStarted ) {
				loggedStarted = true;
				console.log(
					`\nTest ${ chalk.bold( reportId ) } is ${
						worker.status === "running" ? "running" : "in the queue"
					}.`
				);
				console.log( `  View at ${ fetchedWorker.browser_url }.` );
			}

			if ( worker.lastTouch > Date.now() - RUN_WORKER_TIMEOUT ) {
				return;
			}
			if ( refreshes++ >= MAX_WORKER_REFRESHES ) {
				clearInterval( interval );
				if ( retries < MAX_WORKER_RETRIES ) {
					return retryWorker();
				}
				return reject(
					new Error(
						`Worker ${ worker.id } for test ${ reportId } timed out after ${ MAX_WORKER_RETRIES } retries.`
					)
				);
			}
			if ( verbose ) {
				console.log( `\nRefreshing worker ${ worker.id } for test ${ reportId }...${ refreshes }` );
			}
			touchWorker( reportId );
			await changeUrl( worker.id, url );
		}, POLL_WORKER_TIMEOUT );
	} );
}
