import crypto from "node:crypto";

export function generateHash( string ) {
	const hash = crypto.createHash( "md5" );
	hash.update( string );

	// QUnit hashes are 8 characters long
	// We use 10 characters to be more visually distinct
	return hash.digest( "hex" ).slice( 0, 10 );
}

/**
 * A copy of the generate hash function from QUnit,
 * used to generate a hash for the module name.
 *
 * QUnit errors on passing multiple modules to the
 * module query parameter. We need to know
 * the hash for each module before loading QUnit
 * in order to pass multiple moduleId parameters instead.
 */
export function generateModuleId( module, browser ) {

	// QUnit normally hashes the test name, but
	// we've repurposed this function to generate
	// report IDs for module/browser combinations.
	// We still use it without the browser parameter
	// to get the same module IDs as QUnit to pass
	// multiple ahead-of-time in the query string.
	const str = module + "\x1C" + browser;
	let hash = 0;

	for ( let i = 0; i < str.length; i++ ) {
		hash = ( hash << 5 ) - hash + str.charCodeAt( i );
		hash |= 0;
	}

	let hex = ( 0x100000000 + hash ).toString( 16 );
	if ( hex.length < 8 ) {
		hex = "0000000" + hex;
	}

	return hex.slice( -8 );
}

export function printModuleHashes( modules ) {
	console.log( "Module hashes:" );
	modules.forEach( ( module ) => {
		console.log( `  ${ module }: ${ generateModuleId( module ) }` );
	} );
}
