import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const command = path.resolve(
	`node_modules/.bin/promises-aplus-tests${ os.platform() === "win32" ? ".cmd" : "" }`
);
const args = [ "--reporter", "dot", "--timeout", "2000" ];
const defaultTests = [
	"test/promises_aplus_adapters/deferred.cjs",
	"test/promises_aplus_adapters/when.cjs"
];

// Resolve with the sub-process exit code, or `null` if it was killed by a signal.
function spawnTest( test ) {
	return new Promise( ( resolve, reject ) => {
		spawn(
			command,
			[ test ].concat( args ),
			{ shell: true, stdio: "inherit" }
		).on( "error", reject ).on( "close", resolve );
	} );
}

// Resolve with `true` only when every suite exited successfully.
async function runTests( { runTest = spawnTest, testFiles = defaultTests } = {} ) {
	const codes = await Promise.all(
		testFiles.map( ( test ) =>
			runTest( test ).then( ( code ) => {
				if ( code !== 0 ) {
					console.error( `Promises/A+ tests failed for ${ test }.` );
				}
				return code;
			} )
		)
	);

	return codes.every( ( code ) => code === 0 );
}

if ( import.meta.url === pathToFileURL( process.argv[ 1 ] ).href ) {
	runTests().then( ( passed ) => {

		// Propagate failures to the caller. Without this, `npm run
		// test:promises_aplus` exits successfully even when a suite fails, so CI
		// cannot catch regressions in Deferred's Promises/A+ compliance.
		if ( !passed ) {
			process.exitCode = 1;
		}
	}, ( error ) => {
		console.error( error );
		process.exitCode = 1;
	} );
}

export { runTests };
