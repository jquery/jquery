#!/usr/bin/env node
/*
 * jQuery Release Management
 */

var fs = require("fs"),
	child = require("child_process"),
	debug = false;

var scpURL = "jqadmin@code.origin.jquery.com:/var/www/html/code.jquery.com/",
	cdnURL = "http://code.origin.jquery.com/",

	version = /^[\d.]+(?:(?:a|b|rc)\d+|pre)?$/,
	versionFile = "version.txt",
	
	file = "dist/jquery.js",
	minFile = "dist/jquery.min.js",
	
	files = {
		"jquery-VER.js": file,
		"jquery-VER.min.js": minFile
	},
	
	finalFiles = {
		"jquery.js": file,
		"jquery-latest.js": file,
		"jquery.min.js": minFile,
		"jquery-latest.min.js": minFile
	};

exec( "git pull && git status", function( error, stdout, stderr ) {
	if ( /Changes to be committed/i.test( stdout ) ) {
		exit( "Please commit changed files before attemping to push a release." );

	} else if ( /Changes not staged for commit/i.test( stdout ) ) {
		exit( "Please stash files before attempting to push a release." );

	} else {
		setVersion();
	}
});

function setVersion() {
	var oldVersion = fs.readFileSync( versionFile, "utf8" );
	
	prompt( "New Version (was " + oldVersion + "): ", function( data ) {
		if ( data && version.test( data ) ) {
			fs.writeFileSync( versionFile, data );
			
			exec( "git commit -a -m 'Tagging the " + data + " release.' && git push && " +
				"git tag " + data + " && git push origin " + data, function() {
					make( data );
			});
			
		} else {
			console.error( "Malformed version number, please try again." );
			setVersion();
		}
	});
}

function make( newVersion ) {
	exec( "make clean && make", function( error, stdout, stderr ) {
		// TODO: Verify JSLint
		
		Object.keys( files ).forEach(function( oldName ) {
			var value = files[ oldName ], name = oldName.replace( /VER/g, newVersion );

			copy( value, name );

			delete files[ oldName ];
			files[ name ] = value;
		});

		exec( "scp " + Object.keys( files ).join( " " ) + " " + scpURL, function() {
			setNextVersion( newVersion );
		});
	});
}

function setNextVersion( newVersion ) {
	var isFinal = false;
	
	if ( /(?:a|b|rc)\d+$/.test( newVersion ) ) {
		newVersion = newVersion.replace( /(?:a|b|rc)\d+$/, "pre" );
		
	} else if ( /^\d+\.\d+\.?(\d*)$/.test( newVersion ) ) {
		newVersion = newVersion.replace( /^(\d+\.\d+\.?)(\d*)$/, function( all, pre, num ) {
			return pre + (pre.charAt( pre.length - 1 ) !== "." ? "." : "") + (num ? parseFloat( num ) + 1 : 1) + "pre";
		});
		
		isFinal = true;
	}
	
	prompt( "Next Version [" + newVersion + "]: ", function( data ) {
		if ( !data ) {
			data = newVersion;
		}
		
		if ( version.test( data ) ) {
			fs.writeFileSync( versionFile, data );
			
			exec( "git commit -a -m 'Updating the source version to " + data + "' && git push", function() {
				if ( isFinal ) {
					makeFinal( newVersion );
				}
			});
			
		} else {
			console.error( "Malformed version number, please try again." );
			setNextVersion( newVersion );
		}
	});
}

function makeFinal( newVersion ) {
	var all = Object.keys( finalFiles );
	
	// Copy all the files
	all.forEach(function( name ) {
		copy( finalFiles[ name ], name );
	});
	
	// Upload files to CDN
	exec( "scp " + all.join( " " ) + " " + scpURL, function() {
		exec( "curl '" + cdnURL + "{" + all.join( "," ) + "}?reload'", function() {
			console.log( "Done." );
		});
	});
}

function copy( oldFile, newFile ) {
	if ( debug ) {
		console.log( "Copying " + oldFile + " to " + newFile );

	} else {
		fs.writeFileSync( newFile, fs.readFileSync( oldFile, "utf8" ) );
	}
}

function prompt( msg, callback ) {
	process.stdout.write( msg );
	
	process.stdin.resume();
	process.stdin.setEncoding( "utf8" );
	
	process.stdin.once( "data", function( chunk ) {
		process.stdin.pause();
		callback( chunk.replace( /\n*$/g, "" ) );
	});
}

function exec( cmd, fn ) {
	if ( debug ) {
		console.log( cmd );
		fn();

	} else {
		child.exec( cmd, fn );
	}
}

function exit( msg ) {
	if ( msg ) {
		console.error( "\nError: " + msg );
	}

	process.exit( 1 );
}
