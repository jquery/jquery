import { generateModuleId } from "./generateHash.js";

export function buildTestUrl( modules, { amd, browserstack, jsdom, port, reportId } ) {
	if ( !port ) {
		throw new Error( "No port specified." );
	}

	const query = new URLSearchParams();
	for ( const module of modules ) {
		query.append( "moduleId", generateModuleId( module ) );
	}

	if ( amd ) {
		query.append( "amd", "true" );
	}

	if ( jsdom ) {
		query.append( "jsdom", "true" );
	}

	if ( reportId ) {
		query.append( "reportId", reportId );
	}

	// BrowserStack supplies a custom domain for local testing,
	// which is especially necessary for iOS testing.
	const host = browserstack ? "bs-local.com" : "localhost";
	return `http://${ host }:${ port }/test/?${ query }`;
}
