"use strict";

const path = require( "node:path" );

const ROOT_DIR = path.resolve( __dirname, "..", "..", ".." );

// If `jQueryModuleSpecifier` is a real relative path, make it absolute
// to make sure it resolves to the same file inside utils from
// a subdirectory. Otherwise, leave it as-is as we may be testing `exports`
// so we need input as-is.
const getJQueryModuleSpecifier = () =>
	path.resolve( ROOT_DIR, process.argv[ 2 ] );

module.exports = { getJQueryModuleSpecifier };
