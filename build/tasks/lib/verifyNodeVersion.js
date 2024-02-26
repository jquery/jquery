"use strict";

const { version } = require( "process" );
const nodeV18OrNewer = !/^v1[0-7]\./.test( version );

module.exports = function verifyNodeVersion() {
	if ( !nodeV18OrNewer ) {
		console.log( "Old Node.js detected, task skipped..." );
		return false;
	}
	return true;
};
