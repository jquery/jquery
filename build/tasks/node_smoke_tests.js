"use strict";

const fs = require( "fs" );
const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );
const verifyNodeVersion = require( "./lib/verifyNodeVersion" );

const allowedModules = [ "commonjs", "module" ];

if ( !verifyNodeVersion() ) {
	return;
}

// Fire up all tests defined in test/node_smoke_tests/*.js in spawned sub-processes.
// All the files under test/node_smoke_tests/*.js are supposed to exit with 0 code
// on success or another one on failure. Spawning in sub-processes is
// important so that the tests & the main process don't interfere with
// each other, e.g. so that they don't share the `require` cache.

async function runTests( sourceType, module ) {
	if ( !allowedModules.includes( sourceType ) ) {
		throw new Error(
			`Usage: \`node_smoke_tests [${allowedModules.join( "|" )}]:JQUERY\``
		);
	}
	const dir = `./test/node_smoke_tests/${sourceType}`;
	const files = await fs.promises.readdir( dir, { withFileTypes: true } );
	const testFiles = files.filter( ( testFilePath ) => testFilePath.isFile() );
	await Promise.all(
		testFiles.map( ( testFile ) =>
			exec( `node "${dir}/${testFile.name}" "${module}"` )
		)
	);
	console.log( `Node smoke tests passed for ${sourceType} "${module}".` );
}

async function runDefaultTests() {
	await Promise.all( [
		runTests( "commonjs", "jquery" ),
		runTests( "commonjs", "jquery/slim" ),
		runTests( "commonjs", "./dist/jquery.js" ),
		runTests( "commonjs", "./dist/jquery.slim.js" ),
		runTests( "module", "jquery" ),
		runTests( "module", "jquery/slim" ),
		runTests( "module", "./dist-module/jquery.module.js" ),
		runTests( "module", "./dist-module/jquery.slim.module.js" )
	] );
}

runDefaultTests();
