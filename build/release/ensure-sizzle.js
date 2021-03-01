"use strict";

var fs = require( "fs" ),
	chalk = require( "chalk" ),
	sizzleLoc = __dirname + "/../../external/sizzle/dist/sizzle.js",
	rversion = /Engine v(\d+\.\d+\.\d+(?:-[-\.\d\w]+)?)/;

/**
 * Ensure the /src folder has the latest tag of Sizzle
 * @param {Object} Release
 * @param {Function} callback
 */
function ensureSizzle( Release, callback ) {
	console.log();
	console.log( "Checking Sizzle version..." );
	var match = rversion.exec( fs.readFileSync( sizzleLoc, "utf8" ) ),
		version = match ? match[ 1 ] : "Not Found",
		latest = Release.exec( {
			command: "npm info sizzle version",
			silent: true
		} );

	if ( version !== latest ) {
		console.log(
			"The Sizzle version in the src folder (" + chalk.red( version ) +
			") is not the latest tag (" + chalk.green( latest ) + ")."
		);
		Release.confirm( callback );
	} else {
		console.log( "Sizzle is latest (" + chalk.green( latest ) + ")" );
		callback();
	}
}

module.exports = ensureSizzle;
