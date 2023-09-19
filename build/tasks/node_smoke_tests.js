"use strict";

const fs = require( "fs" );
const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );
const verifyNodeVersion = require( "./lib/verifyNodeVersion" );

const allowedLibraryTypes = [ "regular", "factory" ];
const allowedSourceTypes = [ "commonjs", "module" ];

if ( !verifyNodeVersion() ) {
	return;
}

// Fire up all tests defined in test/node_smoke_tests/*.js in spawned sub-processes.
// All the files under test/node_smoke_tests/*.js are supposed to exit with 0 code
// on success or another one on failure. Spawning in sub-processes is
// important so that the tests & the main process don't interfere with
// each other, e.g. so that they don't share the `require` cache.

async function runTests( { libraryType, sourceType, module } ) {
	if ( !allowedLibraryTypes.includes( libraryType ) ||
			!allowedSourceTypes.includes( sourceType ) ) {
		throw new Error( `Incorrect libraryType or sourceType value; passed: ${
			libraryType
		} ${ sourceType } "${ module }"` );
	}
	const dir = `./test/node_smoke_tests/${ sourceType }/${ libraryType }`;
	const files = await fs.promises.readdir( dir, { withFileTypes: true } );
	const testFiles = files.filter( ( testFilePath ) => testFilePath.isFile() );

	if ( !testFiles.length ) {
		throw new Error( `No test files found for ${
			libraryType
		} ${ sourceType } "${ module }"` );
	}

	await Promise.all(
		testFiles.map( ( testFile ) =>
			exec( `node "${ dir }/${ testFile.name }" "${ module }"` )
		)
	);
	console.log( `Node smoke tests passed for ${
		libraryType
	} ${ sourceType } "${ module }".` );
}

async function runDefaultTests() {
	await Promise.all( [
		runTests( {
			libraryType: "regular",
			sourceType: "commonjs",
			module: "jquery"
		} ),
		runTests( {
			libraryType: "regular",
			sourceType: "commonjs",
			module: "jquery/slim"
		} ),
		runTests( {
			libraryType: "regular",
			sourceType: "commonjs",
			module: "./dist/jquery.js"
		} ),
		runTests( {
			libraryType: "regular",
			sourceType: "commonjs",
			module: "./dist/jquery.slim.js"
		} ),
		runTests( {
			libraryType: "regular",
			sourceType: "module",
			module: "jquery"
		} ),
		runTests( {
			libraryType: "regular",
			sourceType: "module",
			module: "jquery/slim"
		} ),
		runTests( {
			libraryType: "regular",
			sourceType: "module",
			module: "./dist-module/jquery.module.js"
		} ),
		runTests( {
			libraryType: "regular",
			sourceType: "module",
			module: "./dist-module/jquery.slim.module.js"
		} ),

		runTests( {
			libraryType: "factory",
			sourceType: "commonjs",
			module: "jquery/factory"
		} ),
		runTests( {
			libraryType: "factory",
			sourceType: "commonjs",
			module: "jquery/factory-slim"
		} ),
		runTests( {
			libraryType: "factory",
			sourceType: "commonjs",
			module: "./dist/jquery.factory.js"
		} ),
		runTests( {
			libraryType: "factory",
			sourceType: "commonjs",
			module: "./dist/jquery.factory.slim.js"
		} ),
		runTests( {
			libraryType: "factory",
			sourceType: "module",
			module: "jquery/factory"
		} ),
		runTests( {
			libraryType: "factory",
			sourceType: "module",
			module: "jquery/factory-slim"
		} ),
		runTests( {
			libraryType: "factory",
			sourceType: "module",
			module: "./dist-module/jquery.factory.module.js"
		} ),
		runTests( {
			libraryType: "factory",
			sourceType: "module",
			module: "./dist-module/jquery.factory.slim.module.js"
		} )
	] );
}

runDefaultTests();
