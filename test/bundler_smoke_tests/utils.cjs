"use strict";

const fs = require( "node:fs/promises" );
const path = require( "node:path" );
const { fileURLToPath } = require( "node:url" );

const TMP_BUNDLERS_DIR = path.resolve( __dirname, "tmp" );

async function cleanTmpBundlersDir() {
	await fs.rm( TMP_BUNDLERS_DIR, {
		force: true,
		recursive: true
	} );
}

module.exports = { cleanTmpBundlersDir };
