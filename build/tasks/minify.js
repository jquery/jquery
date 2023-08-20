"use strict";

const swc = require( "@swc/core" );
const fs = require( "fs" );
const path = require( "path" );
const dist = require( "./dist" );

const rjs = /\.js$/;

async function minify( { filename, folder, esm } ) {
	const contents = await fs.promises.readFile( path.join( folder, filename ), "utf8" );
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
				preamble: `/*! jQuery ${version}` +
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
			path.join( folder, minFilename ),
			code
		),
		fs.promises.writeFile(
			path.join( folder, mapFilename ),
			map
		)
	] );


	console.log( `${minFilename} ${version} with ${mapFilename} created.` );
}

async function minifyDefaultFiles() {

	await Promise.all( [
		minify( { filename: "jquery.js", folder: "dist" } ),
		minify( { filename: "jquery.slim.js", folder: "dist" } ),
		minify( { filename: "jquery.module.js", folder: "dist-module", esm: true } ),
		minify( { filename: "jquery.slim.module.js", folder: "dist-module", esm: true } )
	] );

	await Promise.all( [
		dist( { filename: "jquery.js", folder: "dist" } ),
		dist( { filename: "jquery.slim.js", folder: "dist" } ),
		dist( { filename: "jquery.module.js", folder: "dist-module" } ),
		dist( { filename: "jquery.slim.module.js", folder: "dist-module" } )
	] );

	const { compareSize } = await import( "./compare_size.mjs" );
	return compareSize( {
		files: [
			"dist/jquery.min.js",
			"dist/jquery.slim.min.js",
			"dist-module/jquery.module.min.js",
			"dist-module/jquery.slim.module.min.js"
		]
	} );
}

module.exports = { minify, minifyDefaultFiles };
