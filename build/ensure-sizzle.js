var fs = require( "fs" ),
	bower = require( "grunt-bowercopy/node_modules/bower" ),
	sizzleLoc = __dirname + "/../src/sizzle/dist/sizzle.js",
	rversion = /Engine v(\d+\.\d+\.\d+(?:-\w+)?)/;

/**
 * Retrieve the latest tag of Sizzle from bower
 * @param {Function(string)} callback
 */
function getLatestSizzle( callback ) {
	bower.commands.info( "sizzle", "version" )
		.on( "end", callback );
}

/**
 * Ensure the /src folder has the latest tag of Sizzle
 * @param {Object} Release
 * @param {Function} callback
 */
function ensureSizzle( Release, callback ) {
	console.log();
	console.log( "Checking Sizzle version..." );
	getLatestSizzle(function( latest ) {
		var match = rversion.exec( fs.readFileSync( sizzleLoc, "utf8" ) ),
			version = match ? match[ 1 ] : "Not Found";

		if ( version !== latest ) {
			console.log(
				"The Sizzle version in the src folder (" + version.red +
				") is not the latest tag (" + latest.green + ")."
			);
			Release.confirm( callback );
		} else {
			console.log( "Sizzle is latest (" + latest.green + ")" );
			callback();
		}
	});
}

module.exports = ensureSizzle;
