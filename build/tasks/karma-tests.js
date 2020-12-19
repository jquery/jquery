"use strict";

const spawn = require( "child_process" ).spawn;

module.exports = function( grunt ) {

	// The task runs tests in various browser sets but does it sequentially in
	// separate processes to avoid Karma bugs that cause browsers from previous
	// sets to somehow still be waited on during subsequent runs, failing the build.

	grunt.registerTask( "karma-tests", "Run unit tests sequentially",
		async function( isBrowserStack ) {
			const done = this.async();
			const tasks = isBrowserStack ? [
				"karma:chrome", "karma:edge", "karma:ie",
				"karma:opera", "karma:safari", "karma:firefox"
			] : [ "karma:main" ];

			for ( let task of tasks ) {
				const command = `grunt ${ task }`;
				grunt.log.writeln( `Running task ${ task } in a subprocess...` );

				await new Promise( ( resolve, reject ) => {
					const ret = spawn( command, {
						shell: true,
						stdio: "inherit"
					} );

					ret.on( "close", ( code ) => {
						if ( code === 0 ) {
							resolve();
						} else {
							const message = `Error code ${ code } during command: ${ command }`;
							console.error( message );
							reject( new Error( message ) );
							done( false );
						}
					} );
				} );
			}

			done();
		}
	);
};

