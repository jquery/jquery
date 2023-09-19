"use strict";

const process = require( "node:process" );

if ( typeof Symbol === "undefined" ) {
	console.log( "Symbols not supported, skipping the test..." );
	process.exit();
}

const { ensureIterability } = require( "../lib/ensure_iterability_es6.cjs" );
const { getJQueryModuleSpecifier } = require( "../lib/jquery-module-specifier.cjs" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
ensureIterability( jQueryModuleSpecifier );
