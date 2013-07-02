#!/usr/bin/env node
/*
 * jQuery Core Release Management
 */

// Debugging variables
var	debug = false,
	skipRemote = false;

var fs = require("fs"),
	child = require("child_process"),
	path = require("path"),
	archiver = require("archiver");

var releaseVersion,
	nextVersion,
	isBeta,
	pkg,
	branch,

	scpURL = "jqadmin@code.origin.jquery.com:/var/www/html/code.jquery.com/",
	cdnURL = "http://code.origin.jquery.com/",
	repoURL = "git@github.com:jquery/jquery.git",

	// Windows needs the .cmd version but will find the non-.cmd
	// On Windows, ensure the HOME environment variable is set
	gruntCmd = process.platform === "win32" ? "grunt.cmd" : "grunt",

	devFile = "dist/jquery.js",
	minFile = "dist/jquery.min.js",
	mapFile = "dist/jquery.min.map",

	releaseFiles = {
		"jquery-VER.js": devFile,
		"jquery-VER.min.js": minFile,
		"jquery-VER.min.map": mapFile,
		"jquery.js": devFile,
		"jquery.min.js": minFile,
		"jquery.min.map": mapFile,
		"jquery-latest.js": devFile,
		"jquery-latest.min.js": minFile,
		"jquery-latest.min.map": mapFile
	},

	jQueryFilesCDN = [],

	googleFilesCDN = [
		"jquery.js", "jquery.min.js", "jquery.min.map"
	],

	msFilesCDN = [
		"jquery-VER.js", "jquery-VER.min.js", "jquery-VER.min.map"
	];


steps(
	initialize,
	checkGitStatus,
	tagReleaseVersion,
	gruntBuild,
	makeReleaseCopies,
	setNextVersion,
	copyTojQueryCDN,
	buildGoogleCDN,
	buildMicrosoftCDN,
	pushToGithub,
	exit
);

function initialize( next ) {

	if ( process.argv[2] === "-d" ) {
		process.argv.shift();
		debug = true;
		console.warn("=== DEBUG MODE ===" );
	}

	// First arg should be the version number being released
	var newver, oldver,
		rsemver = /^(\d+)\.(\d+)\.(\d+)(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/,
		version = ( process.argv[3] || "" ).toLowerCase().match( rsemver ) || {},
		major = version[1],
		minor = version[2],
		patch = version[3],
		xbeta = version[4];

	branch = process.argv[2];
	releaseVersion = process.argv[3];
	isBeta = !!xbeta;

	if ( !branch || !major || !minor || !patch ) {
		die( "Usage: " + process.argv[1] + " branch releaseVersion" );
	}
	if ( xbeta === "pre" ) {
		die( "Cannot release a 'pre' version!" );
	}
	if ( !(fs.existsSync || path.existsSync)( "package.json" ) ) {
		die( "No package.json in this directory" );
	}
	pkg = JSON.parse( fs.readFileSync( "package.json" ) );

	console.log( "Current version is " + pkg.version + "; generating release " + releaseVersion );
	version = pkg.version.match( rsemver );
	oldver = ( +version[1] ) * 10000 + ( +version[2] * 100 ) + ( +version[3] )
	newver = ( +major ) * 10000 + ( +minor * 100 ) + ( +patch );
	if ( newver < oldver ) {
		die( "Next version is older than current version!" );
	}

	nextVersion = major + "." + minor + "." + ( isBeta ? patch : +patch + 1 ) + "-pre";
	next();
}

function checkGitStatus( next ) {
	git( [ "status" ], function( error, stdout, stderr ) {
		var onBranch = ((stdout||"").match( /On branch (\S+)/ ) || [])[1];
		if ( onBranch !== branch ) {
			dieIfReal( "Branches don't match: Wanted " + branch + ", got " + onBranch );
		}
		if ( /Changes to be committed/i.test( stdout ) ) {
			dieIfReal( "Please commit changed files before attemping to push a release." );
		}
		if ( /Changes not staged for commit/i.test( stdout ) ) {
			dieIfReal( "Please stash files before attempting to push a release." );
		}
		next();
	});
}

function tagReleaseVersion( next ) {
	updatePackageVersion( releaseVersion );
	git( [ "commit", "-a", "-m", "Tagging the " + releaseVersion + " release." ], function(){
		git( [ "tag", releaseVersion ], next, debug);
	}, debug);
}

function gruntBuild( next ) {
	exec( gruntCmd, [], function( error, stdout ) {
		if ( error ) {
			die( error + stderr );
		}
		console.log( stdout );
		next();
	}, false );
}

function makeReleaseCopies( next ) {
	Object.keys( releaseFiles ).forEach(function( key ) {
		var text,
			builtFile = releaseFiles[ key ],
			unpathedFile = key.replace( /VER/g, releaseVersion ),
			releaseFile = "dist/" + unpathedFile;

		// Beta releases don't update the jquery-latest etc. copies
		if ( !isBeta || key.indexOf( "VER" ) >= 0 ) {

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
				// Minified files point back to the corresponding map;
				// again assume one big happy directory.
				// "//@ sourceMappingURL=jquery.min.map"
				text = fs.readFileSync( builtFile, "utf8" )
					.replace( /\/\/@ sourceMappingURL=\S+/,
						"//@ sourceMappingURL=" + unpathedFile.replace( /\.js$/, ".map" ) );
				fs.writeFileSync( releaseFile, text );
			} else if ( builtFile !== releaseFile ) {
				copy( builtFile, releaseFile );
			}

			jQueryFilesCDN.push( releaseFile );
		}
	});
	next();
}

function setNextVersion( next ) {
	updatePackageVersion( nextVersion );
	git( [ "commit", "-a", "-m", "Updating the source version to " + nextVersion ], next, debug );
}

function copyTojQueryCDN( next ) {
	var cmds = [];

	jQueryFilesCDN.forEach(function( name ) {
		cmds.push(function( nxt ){
			exec( "scp", [ name, scpURL ], nxt, debug || skipRemote );
		});
		cmds.push(function( nxt ){
			exec( "curl", [ cdnURL + name + "?reload" ], nxt, debug || skipRemote );
		});
	});
	cmds.push( next );

	steps.apply( this, cmds );
}

function buildGoogleCDN( next ) {
	makeArchive( "googlecdn", googleFilesCDN, next );
}

function buildMicrosoftCDN( next ) {
	makeArchive( "mscdn", msFilesCDN, next );
}

function pushToGithub( next ) {
	git( [ "push", "--tags", repoURL, branch ], next, debug || skipRemote );
}

//==============================

function steps() {
	var cur = 0,
		steps = arguments;
	(function next(){
		process.nextTick(function(){
			steps[ cur++ ]( next );
		});
	})();
}

function updatePackageVersion( ver ) {
	console.log( "Updating package.json version to " + ver );
	pkg.version = ver;
	if ( !debug ) {
		fs.writeFileSync( "package.json", JSON.stringify( pkg, null, "\t" ) + "\n" );
	}
}

function makeArchive( cdn, files, fn ) {
	if ( isBeta ) {
		console.log( "Skipping archive creation for " + cdn + "; " + releaseVersion + " is beta" );
		process.nextTick( fn );
		return;
	}

	console.log( "Creating production archive for " + cdn );

	var archive = archiver( "zip" ),
		md5file = "dist/" + cdn + "-md5.txt",
		output = fs.createWriteStream( "dist/" + cdn + "-jquery-" + releaseVersion + ".zip" );

	archive.on( "error", function( err ) {
		throw err;
	});

	output.on( "close", fn );
	archive.pipe( output );

	files = files.map(function( item ) {
		return "dist/" + item.replace( /VER/g, releaseVersion );
	});

	exec( "md5sum", files, function( err, stdout, stderr ) {
		fs.writeFileSync( md5file, stdout );
		files.push( md5file );

		files.forEach(function( file ) {
			archive.append( fs.createReadStream( file ), { name: file } );
		});

		archive.finalize();
	}, false );
}

function copy( oldFile, newFile, skip ) {
	console.log( "Copying " + oldFile + " to " + newFile );
	if ( !skip ) {
		fs.writeFileSync( newFile, fs.readFileSync( oldFile, "utf8" ) );
	}
}

function git( args, fn, skip ) {
	exec( "git", args, fn, skip );
}

function exec( cmd, args, fn, skip ) {
	if ( skip ) {
		console.log( "# " + cmd + " " + args.join(" ") );
		fn( "", "", "" );
	} else {
		console.log( cmd + " " + args.join(" ") );
		child.execFile( cmd, args, { env: process.env },
			function( err, stdout, stderr ) {
				if ( err ) {
					die( stderr || stdout || err );
				}
				fn.apply( this, arguments );
			}
		);
	}
}

function dieIfReal( msg ) {
	if ( debug ) {
		console.log ( "DIE: " + msg );
	} else {
		die( msg );
	}
}

function die( msg ) {
	console.error( "ERROR: " + msg );
	process.exit( 1 );
}

function exit() {
	process.exit( 0 );
}
