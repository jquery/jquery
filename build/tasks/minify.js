import fs from "node:fs/promises";
import path from "node:path";
import UglifyJS from "uglify-js";
import processForDist from "./dist.js";
import getTimestamp from "./lib/getTimestamp.js";

const rjs = /\.js$/;

export default async function minify( { dir, filename } ) {
	const filepath = path.join( dir, filename );
	const contents = await fs.readFile( filepath, "utf8" );
	const version = /jQuery JavaScript Library ([^\n]+)/.exec( contents )[ 1 ];
	const banner = `/*! jQuery ${ version }` +
		" | (c) OpenJS Foundation and other contributors" +
		" | jquery.com/license */";

	const minFilename = filename.replace( rjs, ".min.js" );
	const mapFilename = filename.replace( rjs, ".min.map" );

	const { code, error, map: incompleteMap, warning } = UglifyJS.minify(
		contents,
		{
			compress: {
				hoist_funs: false,
				loops: false,

				// Support: IE <11
				// typeofs transformation is unsafe for IE9-10
				// See https://github.com/mishoo/UglifyJS2/issues/2198
				typeofs: false
			},
			output: {
				ascii_only: true,

				// Support: Android 4.0 only
				// UglifyJS 3 breaks Android 4.0 if this option is not enabled.
				// This is in lieu of setting ie for all of mangle, compress, and output
				ie8: true,
				preamble: banner
			},
			sourceMap: {
				filename: minFilename
			}
		}
	);

	if ( error ) {
		throw new Error( error );
	}

	if ( warning ) {
		console.warn( warning );
	}

	// The map's `sources` property is set to an array index.
	// Fix it by setting it to the correct filename.
	const map = JSON.stringify( {
		...JSON.parse( incompleteMap ),
		file: minFilename,
		sources: [ filename ]
	} );

	await Promise.all( [
		fs.writeFile(
			path.join( dir, minFilename ),
			code
		),
		fs.writeFile(
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
}
