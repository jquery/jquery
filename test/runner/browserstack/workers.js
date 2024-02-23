import chalk from "chalk";
import { getBrowserString } from "../lib/getBrowserString.js";
import { changeUrl, createWorker, deleteWorker, getWorker } from "./api.js";

const workers = Object.create( null );

// Acknowledge the worker within the time limit.
// BrowserStack can take around 3min spinning up
// some browsers, such as iOS 15 Safari.
const ACKNOWLEDGE_WORKER_TIMEOUT = 60 * 1000 * 5;
const ACKNOWLEDGE_WORKER_INTERVAL = 1000;

// No report after the time limit
// should refresh the worker
const RUN_WORKER_TIMEOUT = 60 * 1000 * 2;
const MAX_WORKER_RESTARTS = 5;
const MAX_WORKER_REFRESHES = 1;
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

export function debugWorker( reportId ) {
	const worker = workers[ reportId ];
	if ( worker ) {
		worker.debug = true;
	}
}

export function touchWorker( reportId ) {
	const worker = workers[ reportId ];
	if ( worker ) {
		worker.lastTouch = Date.now();
	}
}

export function retryTest( reportId, retries ) {
	const worker = workers[ reportId ];
	if ( worker ) {
		worker.retries ||= 0;
		worker.retries++;
		if ( worker.retries <= retries ) {
			worker.retry = true;
			console.log( `\nRetrying test ${ reportId }...${ worker.retries }` );
			return true;
		}
	}
	return false;
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
				clearTimeout( timeout );
				clearInterval( interval );
				return reject( new Error( `Worker ${ id } not found.` ) );
			}
			if ( worker.lastTouch ) {
				if ( verbose ) {
					console.log( `\nWorker ${ id } acknowledged.` );
				}
				clearTimeout( timeout );
				clearInterval( interval );
				resolve();
			}
		}, ACKNOWLEDGE_WORKER_INTERVAL );
		const timeout = setTimeout( () => {
			clearInterval( interval );
			const worker = workers[ id ];
			reject(
				new Error(
					`Worker ${
						worker ? worker.id : ""
					} for test ${ id } not acknowledged after ${
						ACKNOWLEDGE_WORKER_TIMEOUT / 1000
					}s.`
				)
			);
		}, ACKNOWLEDGE_WORKER_TIMEOUT );
	} );
}

export async function runWorker(
	url,
	browser,
	{ reportId, runId, verbose },
	restarts = 0
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
			console.log( `Retrying worker for test ${ reportId }...${ restarts + 1 }` );
		}
		return runWorker( url, browser, { reportId, runId, verbose }, restarts + 1 );
	}

	// Wait for the worker to be acknowledged
	try {
		await waitForAck( reportId );
	} catch ( error ) {
		if ( !workers[ reportId ] ) {

			// The worker has already been cleaned up
			return;
		}

		if ( restarts < MAX_WORKER_RESTARTS ) {
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
		async function refreshWorker() {
			try {
				await changeUrl( worker.id, url );
				touchWorker( reportId );
				return tick();
			} catch ( error ) {
				if ( !workers[ reportId ] ) {

					// The worker has already been cleaned up
					return resolve();
				}
				console.error( error );
				return retryWorker().then( resolve, reject );
			}
		}

		async function checkWorker() {
			const worker = workers[ reportId ];

			if ( !worker || worker.debug ) {
				return resolve();
			}

			let fetchedWorker;
			try {
				fetchedWorker = await getWorker( worker.id );
			} catch ( error ) {
				return reject( error );
			}
			if (
				!fetchedWorker ||
				( fetchedWorker.status !== "running" && fetchedWorker.status !== "queue" )
			) {
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

			// Refresh the worker if a retry is triggered
			if ( worker.retry ) {
				worker.retry = false;

				// Reset recovery refreshes
				refreshes = 0;
				return refreshWorker();
			}

			if ( worker.lastTouch > Date.now() - RUN_WORKER_TIMEOUT ) {
				return tick();
			}

			refreshes++;

			if ( refreshes >= MAX_WORKER_REFRESHES ) {
				if ( restarts < MAX_WORKER_RESTARTS ) {
					if ( verbose ) {
						console.log(
							`Worker ${ worker.id } not acknowledged after ${
								ACKNOWLEDGE_WORKER_TIMEOUT / 1000
							}s.`
						);
					}
					return retryWorker().then( resolve, reject );
				}
				await cleanupWorker( reportId, verbose );
				return reject(
					new Error(
						`Worker ${ worker.id } for test ${ reportId } timed out after ${ MAX_WORKER_RESTARTS } restarts.`
					)
				);
			}

			if ( verbose ) {
				console.log(
					`\nRefreshing worker ${ worker.id } for test ${ reportId }...${ refreshes }`
				);
			}

			return refreshWorker();
		}

		function tick() {
			setTimeout( checkWorker, POLL_WORKER_TIMEOUT );
		}

		checkWorker();
	} );
}
