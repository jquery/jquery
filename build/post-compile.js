#!/usr/bin/env node

var fs = require( "fs" ),
	src = fs.readFileSync( process.argv[2], "utf8" ),
	version = fs.readFileSync( "version.txt", "utf8" ),
	// License Template
	license = "/*! jQuery v@VERSION jquery.com | jquery.org/license */";


// Previously done in sed but reimplemented here due to portability issues
src = src.replace( /^(\s*\*\/)(.+)/m, "$1\n$2" ) + ";";

// Set minimal license block var
license = license.replace( "@VERSION", version );

// Replace license block with minimal license
src = src.replace( /\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//, license );

fs.writeFileSync( "dist/jquery.min.js", src, "utf8" );
