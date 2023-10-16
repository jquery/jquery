"use strict";

const { spawn } = require( "child_process" );
const verifyNodeVersion = require( "./lib/verifyNodeVersion" );
const path = require( "path" );
const os = require( "os" );

if ( !verifyNodeVersion() ) {
	return;
}

const command = path.resolve(
	__dirname,
	`../../node_modules/.bin/promises-aplus-tests${ os.platform() === "win32" ? ".cmd" : "" }`
);
const args = [ "--reporter", "dot", "--timeout", "2000" ];
const tests = [
	"test/promises_aplus_adapters/deferred.cjs",
	"test/promises_aplus_adapters/when.cjs"
];

async function runTests() {
	tests.forEach( ( test ) => {
		spawn(
			command,
			[ test ].concat( args ),
			{ stdio: "inherit" }
		);
	} );
}

runTests();
