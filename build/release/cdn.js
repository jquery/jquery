var
	fs = require( "fs" ),
	shell = require( "shelljs" ),
	path = require( "path" ),

	cdnFolder = "dist/cdn",

	devFile = "dist/jquery.js",
	minFile = "dist/jquery.min.js",
	mapFile = "dist/jquery.min.map",

	releaseFiles = {
		"jquery-compat-VER.js": devFile,
		"jquery-compat-VER.min.js": minFile,
		"jquery-compat-VER.min.map": mapFile
	},

	googleFilesCDN = [
		"jquery-compat.js", "jquery-compat.min.js", "jquery-compat.min.map"
	],

	msFilesCDN = [
		"jquery-compat-VER.js", "jquery-compat-VER.min.js", "jquery-compat-VER.min.map"
	],

	rver = /VER/,
	rcompat = /\-compat\./g;

/**
 * Generates copies for the CDNs
 */
function makeReleaseCopies( Release ) {
	var version = Release.newVersion.replace( "-compat", "" );
	shell.mkdir( "-p", cdnFolder );

	Object.keys( releaseFiles ).forEach(function( key ) {
		var text,
			builtFile = releaseFiles[ key ],
			unpathedFile = key.replace( /VER/g, version ),
			releaseFile = cdnFolder + "/" + unpathedFile;

		if ( /\.map$/.test( releaseFile ) ) {
			// Map files need to reference the new uncompressed name;
			// assume that all files reside in the same directory.
			// "file":"jquery.min.js","sources":["jquery.js"]
			text = fs.readFileSync( builtFile, "utf8" )
				.replace( /"file":"([^"]+)","sources":\["([^"]+)"\]/,
					"\"file\":\"" + unpathedFile.replace( /\.min\.map/, ".min.js" ) +
					"\",\"sources\":[\"" + unpathedFile.replace( /\.min\.map/, ".js" ) + "\"]" );
			fs.writeFileSync( releaseFile, text );
		} else if ( builtFile !== releaseFile ) {
			shell.cp( "-f", builtFile, releaseFile );
		}
	});
}

function makeArchives( Release, callback ) {

	Release.chdir( Release.dir.repo );

	var version = Release.newVersion.replace( "-compat", "" );

	function makeArchive( cdn, files, callback ) {
		if ( Release.preRelease ) {
			console.log( "Skipping archive creation for " + cdn + "; this is a beta release." );
			callback();
			return;
		}

		console.log( "Creating production archive for " + cdn );

		var sum,
			archiver = require( "archiver" )( "zip" ),
			md5file = cdnFolder + "/" + cdn + "-md5.txt",
			output = fs.createWriteStream(
				cdnFolder + "/" + cdn + "-jquery-compat-" + version + ".zip"
			);

		output.on( "close", callback );

		output.on( "error", function( err ) {
			throw err;
		});

		archiver.pipe( output );

		files = files.map(function( item ) {
			return "dist" + ( rver.test( item ) ? "/cdn" : "" ) + "/" +
				item.replace( rver, version );
		});

		sum = Release.exec(
			// Read jQuery files
			"md5sum " + files.join( " " ).replace( rcompat, "." ),
			"Error retrieving md5sum"
		);
		fs.writeFileSync( "./" + md5file, sum );
		files.push( md5file );

		files.forEach(function( file ) {
			// For Google, read jquery.js, write jquery-compat.js
			archiver.append( fs.createReadStream( file.replace( rcompat, "." ) ),
				{ name: path.basename( file ) } );
		});

		archiver.finalize();
	}

	function buildGoogleCDN( callback ) {
		makeArchive( "googlecdn", googleFilesCDN, callback );
	}

	function buildMicrosoftCDN( callback ) {
		makeArchive( "mscdn", msFilesCDN, callback );
	}

	buildGoogleCDN(function() {
		buildMicrosoftCDN( callback );
	});
}

module.exports = {
	makeReleaseCopies: makeReleaseCopies,
	makeArchives: makeArchives
};
