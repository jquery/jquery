"use strict";

const path = require( "path" );

const TEST_DIR = path.resolve( __dirname, ".." );

module.exports = {
	entry: `${ __dirname }/src-esm-commonjs/main.js`,
	output: {
		filename: "main.js",
		path: `${ TEST_DIR }/data/core/tmp-bundlers/webpack`
	}
};
