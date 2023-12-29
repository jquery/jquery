import { generateHash } from "./generateHash.js";

export function buildTestUrl( modules, { browserstack, port, reportId } ) {
	if ( !port ) {
		throw new Error( "No port specified." );
	}

	const query = new URLSearchParams();
	for ( const module of modules ) {
		query.append( "moduleId", generateHash( module ) );
	}

	if ( reportId ) {
		query.append( "reportId", reportId );
	}

	// BrowserStack supplies a custom domain for local testing,
	// which is especially necessary for iOS testing.
	const host = browserstack ? "bs-local.com" : "localhost";
	return `http://${ host }:${ port }/test/?${ query }`;
}
