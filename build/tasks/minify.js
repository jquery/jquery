"use strict";

const swc = require( "@swc/core" );
const fs = require( "fs" );
const path = require( "path" );
const processForDist = require( "./dist" );
const getTimestamp = require( "./lib/getTimestamp" );

const rjs = /\.js$/;

module.exports = async function minify( { filename, dir, esm } ) {
	const contents = await fs.promises.readFile( path.join( dir, filename ), "utf8" );
	const version = /jQuery JavaScript Library ([^\n]+)/.exec( contents )[ 1 ];

	const { code, map: incompleteMap } = await swc.minify(
		contents,
		{
			compress: {
				ecma: esm ? 2015 : 5,
				hoist_funs: false,
				loops: false
			},
			format: {
				ecma: esm ? 2015 : 5,
				asciiOnly: true,
				comments: false,
				preamble: `/*! jQuery ${ version }` +
					" | (c) OpenJS Foundation and other contributors" +
					" | jquery.org/license */\n"
			},
			mangle: true,
			inlineSourcesContent: false,
			sourceMap: true
		}
	);

	const minFilename = filename.replace( rjs, ".min.js" );
	const mapFilename = filename.replace( rjs, ".min.map" );

	// The map's `files` & `sources` property are set incorrectly, fix
	// them via overrides from the task config.
	// See https://github.com/swc-project/swc/issues/7588#issuecomment-1624345254
	const map = JSON.stringify( {
		...JSON.parse( incompleteMap ),
		file: minFilename,
		sources: [ filename ]
	} );

	await Promise.all( [
		fs.promises.writeFile(
			path.join( dir, minFilename ),
			code
		),
		fs.promises.writeFile(
			path.join( dir, mapFilename ),
			map
		)
	] );

	// Always process files for dist
	// Doing it here avoids extra file reads
	processForDist( contents, filename );
	processForDist( code, minFilename );
	processForDist( map, mapFilename );

	console.log( `[${ getTimestamp() }] ${ minFilename } ${ version } with ${
		mapFilename
	} created.` );
};
