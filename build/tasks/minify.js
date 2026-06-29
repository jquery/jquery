import fs from "node:fs/promises";
import path from "node:path";
import swc from "@swc/core";
import processForDist from "./dist.js";
import getTimestamp from "./lib/getTimestamp.js";

const rjs = /\.js$/;

export default async function minify( { filename, dir, esm } ) {
	const contents = await fs.readFile( path.join( dir, filename ), "utf8" );
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
					" | jquery.com/license */\n"
			},
			inlineSourcesContent: false,
			mangle: true,
			module: esm,
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
