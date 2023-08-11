/**
 * Minify JavaScript using SWC.
 */

"use strict";

module.exports = ( grunt ) => {
	const swc = require( "@swc/core" );

	grunt.registerMultiTask(
		"minify",
		"Minify JavaScript using SWC",
		async function() {
			const done = this.async();
			const options = this.options();
			const sourceMapFilename = options.sourceMap && options.sourceMap.filename;
			const sourceMapOverrides = options.sourceMap && options.sourceMap.overrides || {};

			await Promise.all( this.files.map( async( { src, dest } ) => {
				if ( src.length !== 1 ) {
					grunt.fatal( "The minify task requires a single source per destination" );
				}

				const { code, map: incompleteMap } = await swc.minify(
					grunt.file.read( src[ 0 ] ),
					{
						...options.swc,
						inlineSourcesContent: false,
						sourceMap: sourceMapFilename ?
							{
								filename: sourceMapFilename
							} :
							false
					}
				);

				// Can't seem to get SWC to not use CRLF on Windows, so replace them with LF.
				grunt.file.write( dest, code.replace( /\r\n/g, "\n" ) );

				if ( sourceMapFilename ) {

					// Apply map overrides if needed. See the task config description
					// for more details.
					const mapObject = {
						...JSON.parse( incompleteMap ),
						...sourceMapOverrides
					};
					const map = JSON.stringify( mapObject );

					grunt.file.write( sourceMapFilename, map );
				}
			} ) );

			done();
		}
	);
};
