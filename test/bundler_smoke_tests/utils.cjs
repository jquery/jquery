"use strict";

const fs = require( "node:fs/promises" );
const path = require( "node:path" );
const { fileURLToPath } = require( "node:url" );

const TEST_DIR = path.resolve( __dirname, ".." );
const TMP_BUNDLERS_DIR = path.resolve( TEST_DIR, "data/core/tmp-bundlers" );

async function cleanTmpBundlersDir() {
	await fs.rm( TMP_BUNDLERS_DIR, {
		force: true,
		recursive: true
	} );
}

module.exports = { cleanTmpBundlersDir };
