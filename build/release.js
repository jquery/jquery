#!/usr/bin/env node
/*
 * jQuery Core Release Management
 */

// Debugging variables
var	debug = false,
	skipRemote = false;

var fs = require("fs"),
	child = require("child_process"),
	path = require("path");

var releaseVersion,
	nextVersion,
	CDNFiles,
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
		"jquery-VER.min.map": mapFile //,
// Disable these until 2.0 defeats 1.9 as the ONE TRUE JQUERY
//		"jquery.js": devFile,
//		"jquery.min.js": minFile,
//		"jquery.min.map": mapFile,
//		"jquery-latest.js": devFile,
//		"jquery-latest.min.js": minFile,
//		"jquery-latest.min.map": mapFile
	};

steps(
	initialize,
	checkGitStatus,
	tagReleaseVersion,
	gruntBuild,
	makeReleaseCopies,
	setNextVersion,
	uploadToCDN,
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
			die( "Branches don't match: Wanted " + branch + ", got " + onBranch );
		}
		if ( /Changes to be committed/i.test( stdout ) ) {
			die( "Please commit changed files before attemping to push a release." );
		}
		if ( /Changes not staged for commit/i.test( stdout ) ) {
			die( "Please stash files before attempting to push a release." );
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
	}, debug);
}

function makeReleaseCopies( next ) {
	CDNFiles = {};
	Object.keys( releaseFiles ).forEach(function( key ) {
		var text,
			builtFile = releaseFiles[ key ],
			releaseFile = key.replace( /VER/g, releaseVersion );

		// Beta releases don't update the jquery-latest etc. copies
		if ( !isBeta || key !== releaseFile ) {

			if ( /\.map$/.test( releaseFile ) ) {
				// Map files need to reference the new uncompressed name;
				// assume that all files reside in the same directory.
				// "file":"jquery.min.js","sources":["jquery.js"]
				text = fs.readFileSync( builtFile, "utf8" )
					.replace( /"file":"([^"]+)","sources":\["([^"]+)"\]/,
						"\"file\":\"" + releaseFile.replace( /\.min\.map/, ".min.js" ) +
						"\",\"sources\":[\"" + releaseFile.replace( /\.min\.map/, ".js" ) + "\"]" );
				console.log( "Modifying map " + builtFile + " to " + releaseFile );
				if ( !debug ) {
					fs.writeFileSync( releaseFile, text );
				}
			} else {
				copy( builtFile, releaseFile );
			}

			CDNFiles[ releaseFile ] = builtFile;
		}
	});
	next();
}

function setNextVersion( next ) {
	updatePackageVersion( nextVersion );
	git( [ "commit", "-a", "-m", "Updating the source version to " + nextVersion ], next, debug );
}

function uploadToCDN( next ) {
	var cmds = [];

	Object.keys( CDNFiles ).forEach(function( name ) {
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

function copy( oldFile, newFile ) {
	console.log( "Copying " + oldFile + " to " + newFile );
	if ( !debug ) {
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

function die( msg ) {
	console.error( "ERROR: " + msg );
	process.exit( 1 );
}

function exit() {
	process.exit( 0 );
}
