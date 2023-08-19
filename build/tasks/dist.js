"use strict";

const fs = require( "fs" );

// Process files for distribution.
async function dist( {
	filename = "jquery.js",
	distFolder = "dist"
} = {} ) {
	const distPaths = [
		`${distFolder}/${filename}`,
		`${distFolder}/${filename.replace( ".js", ".min.js" )}`,
		`${distFolder}/${filename.replace( ".js", ".min.map" )}`
	];

	// Ensure the dist files are pure ASCII
	const promises = distPaths.map( async function( fullPath ) {
		const text = await fs.promises.readFile( fullPath, "utf8" );

		// Ensure files use only \n for line endings, not \r\n
		if ( /\x0d\x0a/.test( text ) ) {
			throw new Error( fullPath + ": Incorrect line endings (\\r\\n)" );
		}

		// Ensure only ASCII chars so script tags don't need a charset attribute
		if ( text.length !== Buffer.byteLength( text, "utf8" ) ) {
			let message = fullPath + ": Non-ASCII characters detected:\n";
			for ( let i = 0; i < text.length; i++ ) {
				const c = text.charCodeAt( i );
				if ( c > 127 ) {
					message += "- position " + i + ": " + c + "\n";
					message += "==> " + text.substring( i - 20, i + 20 );
					break;
				}
			}
			throw new Error( message );
		}
	} );

	return Promise.all( promises );
}

function prepareDefaultFiles() {
	return Promise.all( [
		dist(),
		dist( { filename: "jquery.slim.js" } ),
		dist( { filename: "jquery.module.js", distFolder: "dist-module" } ),
		dist( { filename: "jquery.slim.module.js", distFolder: "dist-module" } )
	] );
}

prepareDefaultFiles();
