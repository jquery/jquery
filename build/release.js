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

	sizzleLoc = "bower_modules/sizzle",

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
		"jquery-VER.min.map": mapFile //,
// Disable these until 2.0 defeats 1.9 as the ONE TRUE JQUERY
//		"jquery.js": devFile,
//		"jquery.min.js": minFile,
//		"jquery.min.map": mapFile,
//		"jquery-latest.js": devFile,
//		"jquery-latest.min.js": minFile,
//		"jquery-latest.min.map": mapFile
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
	setReleaseVersion,
	gruntBuild,
	makeReleaseCopies,
	copyTojQueryCDN,
	buildGoogleCDN,
	buildMicrosoftCDN,
	createTag,
	setNextVersion,
	pushToGithub,
	// publishToNpm,
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
		exists = fs.existsSync || path.existsSync,
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
	if ( !exists( "package.json" ) ) {
		die( "No package.json in this directory" );
	}
	if ( !exists( sizzleLoc ) ) {
		die( "Sizzle expected to exist at " + sizzleLoc );
	}
	pkg = readJSON( "package.json" );

	console.log( "Current version is " + pkg.version + "; generating release " + releaseVersion );
	version = pkg.version.match( rsemver );
	oldver = ( +version[1] ) * 10000 + ( +version[2] * 100 ) + ( +version[3] );
	newver = ( +major ) * 10000 + ( +minor * 100 ) + ( +patch );
	if ( newver < oldver ) {
		die( "Next version is older than current version!" );
	}

	nextVersion = major + "." + minor + "." + ( isBeta ? patch : +patch + 1 ) + "-pre";
	next();
}

function checkGitStatus( next ) {
	git( [ "status" ], function( error, stdout ) {
		var onBranch = ((stdout||"").match( /On branch (\S+)/ ) || [])[1];
		if ( onBranch !== branch ) {
			dieIfReal( "Branches don't match: Wanted " + branch + ", got " + onBranch );
		}
		if ( /Changes to be committed/i.test( stdout ) ) {
			dieIfReal( "Please commit changed files before attempting to push a release." );
		}
		if ( /Changes not staged for commit/i.test( stdout ) ) {
			dieIfReal( "Please stash files before attempting to push a release." );
		}
		next();
	});
}

function setReleaseVersion( next ) {
	updateVersion( releaseVersion );
	git( [ "commit", "-a", "-m", "Updating version to " + releaseVersion + "." ], next, debug );
}

function gruntBuild( next ) {
	// First clean the dist directory of anything we're not about to rebuild
	git( [ "clean", "-dfx", "dist/" ], function() {
		exec( gruntCmd, [], function( error, stdout, stderr ) {
			if ( error ) {
				die( error + stderr );
			}
			console.log( stdout );
			next();
		}, false );
	}, debug );
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
				// Remove the source map comment; it causes way too many problems.
				// Keep the map file in case DevTools allow manual association.
				text = fs.readFileSync( builtFile, "utf8" )
					.replace( /\/\/# sourceMappingURL=\S+/, "" );
				fs.writeFileSync( releaseFile, text );
			} else if ( builtFile !== releaseFile ) {
				copy( builtFile, releaseFile );
			}

			jQueryFilesCDN.push( releaseFile );
		}
	});
	next();
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

function createTag( next ) {
	steps(
		checkoutCommit,
		commitDistFiles,
		tagRelease,
		checkoutBranch,
		next
	);
}

function setNextVersion( next ) {
	updateVersion( nextVersion );
	git( [ "commit", "-a", "-m", "Updating the source version to " + nextVersion + "✓™" ], next, debug );
}

function pushToGithub( next ) {
	git( [ "push", "--tags", repoURL, branch ], next, debug || skipRemote );
}

/* Utilities
---------------------------------------------------------------------- */
function steps() {
	var cur = 0,
		st = arguments;
	(function next(){
		process.nextTick(function(){
			st[ cur++ ]( next );
		});
	})();
}

function readJSON( filename ) {
	return JSON.parse( fs.readFileSync( filename ) );
}

function replaceVersionJSON( file, version ) {
	var text = fs.readFileSync( file, "utf8" );
	text = text.replace( /("version":\s*")[^"]+/, "$1" + version );
	fs.writeFileSync( file, text );
}

function updateVersion( ver ) {
	console.log( "Updating version to " + ver );
	pkg.version = ver;
	if ( !debug ) {
		[ "package.json", "bower.json" ].forEach(function( filename ) {
			replaceVersionJSON( filename, ver );
		});
	}
}

function copy( oldFile, newFile, skip ) {
	console.log( "Copying " + oldFile + " to " + newFile );
	if ( !skip ) {
		fs.writeFileSync( newFile, fs.readFileSync( oldFile, "utf8" ) );
	}
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

function git( args, fn, skip ) {
	exec( "git", args, fn, skip );
}


/* Tag creation
---------------------------------------------------------------------- */
function checkoutCommit( next ) {
	git( [ "checkout", "HEAD^0" ], next, debug );
}

function commitDistFiles( next ) {
	// Remove scripts property from package.json
	// Building and bower are irrelevant as those files will be committed
	// Makes for a clean npm install
	var pkgClone = readJSON( "package.json" );
	delete pkgClone.scripts;
	fs.writeFileSync( "package.json", JSON.stringify( pkgClone, null, "\t" ) );
	// Add files to be committed
	git( [ "add", "package.json" ], function() {
		git( [ "commit", "-m", "Remove scripts property from package.json" ], function() {
			// Add sizzle in a separate commit to avoid a big diff
			// Use force to add normally ignored files
			git( [ "add", "-f", sizzleLoc ], function() {
				git( [ "commit", "-m", "Add sizzle" ], function() {
					// Add jquery files for distribution in a final commit
					git( [ "add", "-f", devFile, minFile, mapFile ], function() {
						git( [ "commit", "-m", releaseVersion ], next, debug );
					}, debug );
				}, debug );
			}, debug );
		}, debug );
	}, debug );
}

function tagRelease( next ) {
	git( [ "tag", releaseVersion ], next, debug );
}

function checkoutBranch( next ) {
	// Reset files to previous state before leaving the commit
	git( [ "reset", "--hard", "HEAD" ], function() {
		git( [ "checkout", branch ], next, debug );
	}, debug );
}

/* Archive creation
---------------------------------------------------------------------- */
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

	exec( "md5sum", files, function( err, stdout ) {
		fs.writeFileSync( md5file, stdout );
		files.push( md5file );

		files.forEach(function( file ) {
			archive.append( fs.createReadStream( file ), { name: file } );
		});

		archive.finalize();
	}, false );
}

/* NPM
---------------------------------------------------------------------- */
/*
function publishToNpm( next ) {
	// Only publish the master branch to NPM
	// You must be the jquery npm user for this not to fail
	// To check, run `npm whoami`
	// Log in to the jquery user with `npm adduser`
	if ( branch !== "master" ) {
		next();
		return;
	}
	git( [ "checkout", releaseVersion ], function() {
		// Only publish committed files
		git( [ "clean", "-dfx" ], function() {
			var args = [ "publish" ];
			// Tag the version as beta if necessary
			if ( isBeta ) {
				args.push( "--tag", "beta" );
			}
			exec( "npm", args, function() {
				git( [ "checkout", branch ], next, debug );
			}, debug || skipRemote );
		}, debug );
	}, debug);
}*/

/* Death
---------------------------------------------------------------------- */
function die( msg ) {
	console.error( "ERROR: " + msg );
	process.exit( 1 );
}

function dieIfReal( msg ) {
	if ( debug ) {
		console.log ( "DIE: " + msg );
	} else {
		die( msg );
	}
}

function exit() {
	process.exit( 0 );
}
