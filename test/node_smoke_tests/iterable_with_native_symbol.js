"use strict";

if ( typeof Symbol === "undefined" ) {
	console.log( "Symbols not supported, skipping the test..." );
	process.exit();
}

require( "./lib/ensure_iterability_es6" )();
