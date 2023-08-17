"use strict";

const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );

module.exports = async function isCleanWorkingDir() {
	const { stdout } = await exec( "git status --untracked-files=no --porcelain" );
	return !stdout.trim();
};
