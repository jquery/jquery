"use strict";

const { version } = require( "process" );
const nodeV16OrNewer = !/^v1[0-5]\./.test( version );

module.exports = function verifyNodeVersion() {
	if ( !nodeV16OrNewer ) {
		console.log( "Old Node.js detected, task skipped..." );
		return false;
	}
	return true;
};
