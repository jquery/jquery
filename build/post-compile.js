#!/usr/bin/env node

var print = require( "sys" ).print,
	fs = require( "fs" ),
	src = fs.readFileSync( process.argv[2], "utf8" ),
	version = fs.readFileSync( "version.txt", "utf8" ),
	// License Template
	license = "/*! jQuery v@VERSION @DATE http://jquery.com/ | http://jquery.org/license */";


license = license.replace( "@VERSION", version )
						.replace( "@DATE", (new Date()).toLocaleString() );

// Previously done in sed but reimplemented here due to portability issues
src = src.replace( /^(\s*\*\/)(.+)/m, "$1\n$2" ) + ";";

// Replace license block with minimal license
src = src.replace( /\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//, license );

print( src );
