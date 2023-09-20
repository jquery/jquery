"use strict";

const fs = require( "fs" );
const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );
const verifyNodeVersion = require( "./lib/verifyNodeVersion" );

if ( !verifyNodeVersion() ) {
	return;
}

// Fire up all tests defined in test/node_smoke_tests/*.js in spawned sub-processes.
// All the files under test/node_smoke_tests/*.js are supposed to exit with 0 code
// on success or another one on failure. Spawning in sub-processes is
// important so that the tests & the main process don't interfere with
// each other, e.g. so that they don't share the `require` cache.

async function runTests( { module } ) {
	const dir = "./test/node_smoke_tests";
	const files = await fs.promises.readdir( dir, { withFileTypes: true } );
	const testFiles = files.filter( ( testFilePath ) => testFilePath.isFile() );

	if ( !testFiles.length ) {
		throw new Error( `No test files found for "${module}"` );
	}

	await Promise.all(
		testFiles.map( ( testFile ) =>
			exec( `node "${dir}/${testFile.name}" ${module}` )
		)
	);
	console.log( `Node smoke tests passed for "${module}".` );
}

async function runDefaultTests() {
	await Promise.all( [
		runTests( { module: "./dist/jquery.js" } ),
		runTests( { module: "./dist/jquery.slim.js" } )
	] );
}

runDefaultTests();
