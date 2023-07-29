"use strict";

const fs = require( "fs" );
const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );
const verifyNodeVersion = require( "./lib/verifyNodeVersion" );
const { argv } = require( "process" );
const args = argv.slice( 2 );

const allowedModules = [ "commonjs", "module" ];

if ( !verifyNodeVersion() ) {
	return;
}

// Fire up all tests defined in test/node_smoke_tests/*.js in spawned sub-processes.
// All the files under test/node_smoke_tests/*.js are supposed to exit with 0 code
// on success or another one on failure. Spawning in sub-processes is
// important so that the tests & the main process don't interfere with
// each other, e.g. so that they don't share the `require` cache.

async function runTests() {
	const promises = args.map( async( arg ) => {
		const [ moduleType, module ] = arg.split( ":" );
		if ( !allowedModules.includes( moduleType ) ) {
			throw new Error(
				`Usage: \`node_smoke_tests [${allowedModules.join( "|" )}]:JQUERY\``
			);
		}
		const files = await fs.promises.readdir(
			`./test/node_smoke_tests/${moduleType}`,
			{ withFileTypes: true }
		);
		const testFiles = files.filter( ( testFilePath ) => testFilePath.isFile() );
		return Promise.all(
			testFiles.map( ( testFile ) =>
				exec( `node "${testFile.path}/${testFile.name}" "${module}"` )
			)
		);
	} );
	Promise.all( promises ).then( () => {
		console.log( `Node smoke tests passed for ${args.join( ", " )}.` );
	} );
}

runTests();
