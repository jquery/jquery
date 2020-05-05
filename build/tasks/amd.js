/**
 * Compiles sources from ES Modules in `src/` to AMD in `amd/`.
 */

"use strict";

module.exports = function( grunt ) {
	const path = require( "path" );
	const rimraf = require( "rimraf" );
	const rollup = require( "rollup" );
	const srcFolder = path.resolve( __dirname, "..", "..", "src" );
	const amdFolder = path.resolve( srcFolder, "..", "amd" );
	const inputFileName = "jquery.js";

	const inputRollupOptions = {
		input: path.resolve( srcFolder, inputFileName ),
		preserveModules: true
	};

	const outputRollupOptions = {
		format: "amd",
		dir: "amd",
		indent: false
	};

	grunt.registerTask(
		"amd",
		"Convert ES modules from `src/` to AMD modules in `amd/`",
		async function() {
			const done = this.async();

			try {
				grunt.verbose.writeln( "Removing the 'amd' directory..." );
				rimraf( amdFolder, async function() {
					const bundle = await rollup.rollup( inputRollupOptions );
					await bundle.write( outputRollupOptions );
					grunt.log.ok( "Sources from 'src' converted to AMD in 'amd'." );
					done();
				} );
			} catch ( err ) {
				done( err );
			}
		} );
};
