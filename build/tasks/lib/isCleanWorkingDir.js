"use strict";

const util = require( "node:util" );
const exec = util.promisify( require( "node:child_process" ).exec );

module.exports = async function isCleanWorkingDir() {
	const { stdout } = await exec( "git status --untracked-files=no --porcelain" );
	return !stdout.trim();
};
