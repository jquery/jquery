"use strict";

module.exports = ( grunt ) => {
	const fs = require( "fs" );
	const spawnTest = require( "./lib/spawn_test.js" );
	const nodeV16OrNewer = !/^v1[0-5]\./.test( process.version );

	grunt.registerTask( "node_smoke_tests", function( moduleType, jQueryModuleSpecifier ) {
		if (
			( moduleType !== "commonjs" && moduleType !== "module" ) ||
			!jQueryModuleSpecifier
		) {
			grunt.fatal( "Use `node_smoke_tests:commonjs:JQUERY` " +
				"or `node_smoke_tests:module:JQUERY.\n" +
				"JQUERY can be `jquery`, `jquery/slim` or a path to any of them." );
		}

		if ( !nodeV16OrNewer ) {
			grunt.log.writeln( "Old Node.js detected, running the task " +
				`"node_smoke_tests:${ moduleType }:${ jQueryModuleSpecifier }" skipped...` );
			return;
		}

		const testsDir = `./test/node_smoke_tests/${ moduleType }`;
		const nodeSmokeTests = [];

		// Fire up all tests defined in test/node_smoke_tests/*.js in spawned sub-processes.
		// All the files under test/node_smoke_tests/*.js are supposed to exit with 0 code
		// on success or another one on failure. Spawning in sub-processes is
		// important so that the tests & the main process don't interfere with
		// each other, e.g. so that they don't share the `require` cache.

		fs.readdirSync( testsDir )
			.filter( ( testFilePath ) =>
				fs.statSync( `${ testsDir }/${ testFilePath }` ).isFile() &&
					/\.m?js$/.test( testFilePath )
			)
			.forEach( ( testFilePath ) => {
				const taskName = `node_${ testFilePath.replace( /\.m?js$/, "" ) }:${ moduleType }:${ jQueryModuleSpecifier }`;

				grunt.registerTask( taskName, function() {
					spawnTest( this.async(), `node "${ testsDir }/${
						testFilePath }" ${ jQueryModuleSpecifier }` );
				} );

				nodeSmokeTests.push( taskName );
			} );

		grunt.task.run( nodeSmokeTests );
	} );
};
