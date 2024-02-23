/**
 * Browserstack API is documented at
 * https://github.com/browserstack/api
 */

import { createAuthHeader } from "./createAuthHeader.js";

const browserstackApi = "https://api.browserstack.com";
const apiVersion = 5;

const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

// iOS has null for version numbers,
// and we do not need a similar check for OS versions.
const rfinalVersion = /(?:^[0-9\.]+$)|(?:^null$)/;
const rnonDigits = /(?:[^\d\.]+)|(?:20\d{2})/g;

async function fetchAPI( path, options = {}, versioned = true ) {
	if ( !username || !accessKey ) {
		throw new Error(
			"BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables must be set."
		);
	}
	const init = {
		method: "GET",
		...options,
		headers: {
			authorization: createAuthHeader( username, accessKey ),
			accept: "application/json",
			"content-type": "application/json",
			...options.headers
		}
	};
	const response = await fetch(
		`${ browserstackApi }/${ versioned ? `${ apiVersion }/` : "" }${ path }`,
		init
	);
	if ( !response.ok ) {
		console.log(
			`\n${ init.method } ${ path }`,
			response.status,
			response.statusText
		);
		throw new Error( `Error fetching ${ path }` );
	}
	return response.json();
}

/**
 * =============================
 * Browsers API
 * =============================
 */

function compareVersionNumbers( a, b ) {
	if ( a != null && b == null ) {
		return -1;
	}
	if ( a == null && b != null ) {
		return 1;
	}
	if ( a == null && b == null ) {
		return 0;
	}
	const aParts = a.replace( rnonDigits, "" ).split( "." );
	const bParts = b.replace( rnonDigits, "" ).split( "." );

	if ( aParts.length > bParts.length ) {
		return -1;
	}
	if ( aParts.length < bParts.length ) {
		return 1;
	}

	for ( let i = 0; i < aParts.length; i++ ) {
		const aPart = Number( aParts[ i ] );
		const bPart = Number( bParts[ i ] );
		if ( aPart < bPart ) {
			return -1;
		}
		if ( aPart > bPart ) {
			return 1;
		}
	}
}

function sortBrowsers( a, b ) {
	if ( a.browser < b.browser ) {
		return -1;
	}
	if ( a.browser > b.browser ) {
		return 1;
	}
	const browserComparison = compareVersionNumbers(
		a.browser_version,
		b.browser_version
	);
	if ( browserComparison ) {
		return browserComparison;
	}
	if ( a.os < b.os ) {
		return -1;
	}
	if ( a.os > b.os ) {
		return 1;
	}
	const osComparison = compareVersionNumbers( a.os_version, b.os_version );
	if ( osComparison ) {
		return osComparison;
	}
	const deviceComparison = compareVersionNumbers( a.device, b.device );
	if ( deviceComparison ) {
		return deviceComparison;
	}
	return 0;
}

export async function getBrowsers( flat ) {
	const query = new URLSearchParams();
	if ( flat ) {
		query.append( "flat", true );
	}
	const browsers = await fetchAPI( `/browsers?${ query }` );
	return browsers.sort( sortBrowsers );
}

function matchVersion( browserVersion, version ) {
	if ( !version ) {
		return false;
	}
	const regex = new RegExp(
		`^${ version.replace( /\\/g, "\\\\" ).replace( /\./g, "\\." ) }\\b`,
		"i"
	);
	return regex.test( browserVersion );
}

export async function filterBrowsers( filter ) {
	const browsers = await getBrowsers( true );
	if ( !filter ) {
		return browsers;
	}
	const filterBrowser = ( filter.browser || "" ).toLowerCase();
	const filterVersion = ( filter.browser_version || "" ).toLowerCase();
	const filterOs = ( filter.os || "" ).toLowerCase();
	const filterOsVersion = ( filter.os_version || "" ).toLowerCase();
	const filterDevice = ( filter.device || "" ).toLowerCase();

	return browsers.filter( ( browser ) => {
		return (
			( !filterBrowser || filterBrowser === browser.browser.toLowerCase() ) &&
			( !filterVersion ||
				matchVersion( browser.browser_version, filterVersion ) ) &&
			( !filterOs || filterOs === browser.os.toLowerCase() ) &&
			( !filterOsVersion ||
				filterOsVersion === browser.os_version.toLowerCase() ) &&
			( !filterDevice || filterDevice === ( browser.device || "" ).toLowerCase() )
		);
	} );
}

export async function listBrowsers( filter ) {
	const browsers = await filterBrowsers( filter );
	console.log( "Available browsers:" );
	for ( const browser of browsers ) {
		let message = `    ${ browser.browser }_`;
		if ( browser.device ) {
			message += `:${ browser.device }_`;
		} else {
			message += `${ browser.browser_version }_`;
		}
		message += `${ browser.os }_${ browser.os_version }`;
		console.log( message );
	}
}

export async function getLatestBrowser( filter ) {
	const browsers = await filterBrowsers( filter );

	return browsers.findLast( ( browser ) =>
		rfinalVersion.test( browser.browser_version )
	);
}

/**
 * =============================
 * Workers API
 * =============================
 */

/**
 * A browser object may only have one of `browser` or `device` set;
 * which property is set will depend on `os`.
 *
 * `options`: is an object with the following properties:
 *   `os`: The operating system.
 *   `os_version`: The operating system version.
 *   `browser`: The browser name.
 *   `browser_version`: The browser version.
 *   `device`: The device name.
 *   `url` (optional): Which URL to navigate to upon creation.
 *   `timeout` (optional): Maximum life of the worker (in seconds). Maximum value of `1800`. Specifying `0` will use the default of `300`.
 *   `name` (optional): Provide a name for the worker.
 *   `build` (optional): Group workers into a build.
 *   `project` (optional): Provide the project the worker belongs to.
 *   `resolution` (optional): Specify the screen resolution (e.g. "1024x768").
 *   `browserstack.local` (optional): Set to `true` to mark as local testing.
 *   `browserstack.video` (optional): Set to `false` to disable video recording.
 *   `browserstack.localIdentifier` (optional): ID of the local tunnel.
 */
export function createWorker( options ) {
	return fetchAPI( "/worker", {
		method: "POST",
		body: JSON.stringify( options )
	} );
}

/**
 * Returns a worker object, if one exists, with the following properties:
 *   `id`: The worker id.
 *   `status`: A string representing the current status of the worker.
 *     Possible statuses: `"running"`, `"queue"`.
 */
export function getWorker( id ) {
	return fetchAPI( `/worker/${ id }` );
}

export async function deleteWorker( id, verbose ) {
	await fetchAPI( `/worker/${ id }`, { method: "DELETE" } );
	if ( verbose ) {
		console.log( `\nWorker ${ id } stopped.` );
	}
}

export function getWorkers() {
	return fetchAPI( "/workers" );
}

/**
 * Change the URL of a worker,
 * or refresh if it's the same URL.
 */
export function changeUrl( id, url ) {
	return fetchAPI( `/worker/${ id }/url.json`, {
		method: "PUT",
		body: JSON.stringify( {
			timeout: 20,
			url: encodeURI( url )
		} )
	} );
}

/**
 * Stop all workers
 */
export async function stopWorkers() {
	const workers = await getWorkers();

	// Run each request on its own
	// to avoid connect timeout errors.
	for ( const worker of workers ) {
		try {
			await deleteWorker( worker.id, true );
		} catch ( error ) {

			// Log the error, but continue trying to remove workers.
			console.error( error );
		}
	}
}

/**
 * =============================
 * Plan API
 * =============================
 */

export function getPlan() {
	return fetchAPI( "/automate/plan.json", {}, false );
}

export async function getMaxSessions() {
	const [ plan, workers ] = await Promise.all( [ getPlan(), getWorkers() ] );
	return plan.parallel_sessions_max_allowed - workers.length;
}
