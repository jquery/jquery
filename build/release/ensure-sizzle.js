var fs = require( "fs" ),
	npm = require( "npm" ),
	sizzleLoc = __dirname + "/../../external/sizzle/dist/sizzle.js",
	rversion = /Engine v(\d+\.\d+\.\d+(?:-[-\.\d\w]+)?)/;

/**
 * Retrieve the latest tag of Sizzle from npm
 * @param {Function(string)} callback
 */
function getLatestSizzle( callback ) {
	npm.load( function( err, npm ) {
		if ( err ) {
			throw err;
		}
		npm.commands.info( [ "sizzle", "version" ], function( err, info ) {
			if ( err ) {
				throw err;
			}
			callback( Object.keys( info )[ 0 ] );
		} );
	} );
}

/**
 * Ensure the /src folder has the latest tag of Sizzle
 * @param {Object} Release
 * @param {Function} callback
 */
function ensureSizzle( Release, callback ) {
	console.log();
	console.log( "Checking Sizzle version..." );
	getLatestSizzle( function( latest ) {
		var match = rversion.exec( fs.readFileSync( sizzleLoc, "utf8" ) ),
			version = match ? match[ 1 ] : "Not Found";

		if ( version !== latest ) {

			// colors is inherited from jquery-release
			console.log(
				"The Sizzle version in the src folder (" + version.red +
				") is not the latest tag (" + latest.green + ")."
			);
			Release.confirm( callback );
		} else {
			console.log( "Sizzle is latest (" + latest.green + ")" );
			callback();
		}
	} );
}

module.exports = ensureSizzle;
