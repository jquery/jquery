var
	fs = require( "fs" ),
	shell = require( "shelljs" ),

	cdnFolder = "dist/cdn",

	devFile = "dist/jquery.js",
	minFile = "dist/jquery.min.js",
	mapFile = "dist/jquery.min.map",

	releaseFiles = {
		"jquery-VER.js": devFile,
		"jquery-VER.min.js": minFile,
		"jquery-VER.min.map": mapFile
	},

	googleFilesCDN = [
		"jquery.js", "jquery.min.js", "jquery.min.map"
	],

	msFilesCDN = [
		"jquery-VER.js", "jquery-VER.min.js", "jquery-VER.min.map"
	];

/**
 * Generates copies for the CDNs
 */
function makeReleaseCopies( Release ) {
	shell.mkdir( "-p", cdnFolder );

	Object.keys( releaseFiles ).forEach(function( key ) {
		var text,
			builtFile = releaseFiles[ key ],
			unpathedFile = key.replace( /VER/g, Release.newVersion ),
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
		} else if ( /\.min\.js$/.test( releaseFile ) ) {
			// Remove the source map comment; it causes way too many problems.
			// Keep the map file in case DevTools allow manual association.
			text = fs.readFileSync( builtFile, "utf8" )
				.replace( /\/\/# sourceMappingURL=\S+/, "" );
			fs.writeFileSync( releaseFile, text );
		} else if ( builtFile !== releaseFile ) {
			shell.cp( "-f", builtFile, releaseFile );
		}
	});
}

function makeArchive( Release, cdn, files ) {
	if ( Release.preRelease ) {
		console.log( "Skipping archive creation for " + cdn + "; this is a beta release." );
		return;
	}

	console.log( "Creating production archive for " + cdn );

	var archiver = require( "archiver" )( "zip" ),
		md5file = cdnFolder + "/" + cdn + "-md5.txt",
		output = fs.createWriteStream(
			cdnFolder + "/" + cdn + "-jquery-" + Release.newVersion + ".zip"
		);

	output.on( "error", function( err ) {
		throw err;
	});

	archiver.pipe( output );

	files = files.map(function( item ) {
		return cdnFolder + "/" + item.replace( /VER/g, Release.newVersion );
	});

	shell.exec( "md5sum", files, function( code, stdout ) {
		fs.writeFileSync( md5file, stdout );
		files.push( md5file );

		files.forEach(function( file ) {
			archiver.append( fs.createReadStream( file ), { name: file } );
		});

		archiver.finalize();
	});
}

function buildGoogleCDN( Release ) {
	makeArchive( Release, "googlecdn", googleFilesCDN );
}

function buildMicrosoftCDN( Release ) {
	makeArchive( Release, "mscdn", msFilesCDN );
}

module.exports = {
	makeReleaseCopies: makeReleaseCopies,
	buildGoogleCDN: buildGoogleCDN,
	buildMicrosoftCDN: buildMicrosoftCDN
};
