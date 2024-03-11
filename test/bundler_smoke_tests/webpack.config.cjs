"use strict";

module.exports = {
	entry: `${ __dirname }/src-esm-commonjs/main.js`,
	output: {
		filename: "main.js",
		path: `${ __dirname }/tmp/webpack`
	}
};
