import fs from "node:fs/promises";
import path from "node:path";

const projectDir = path.resolve( "." );

const files = {
	"bootstrap/bootstrap.css": "bootstrap/dist/css/bootstrap.css",
	"bootstrap/bootstrap.min.css": "bootstrap/dist/css/bootstrap.min.css",
	"bootstrap/bootstrap.min.css.map": "bootstrap/dist/css/bootstrap.min.css.map",

	"core-js-bundle/core-js-bundle.js": "core-js-bundle/minified.js",
	"core-js-bundle/LICENSE": "core-js-bundle/LICENSE",

	"npo/npo.js": "native-promise-only/lib/npo.src.js",

	"qunit/qunit.js": "qunit/qunit/qunit.js",
	"qunit/qunit.css": "qunit/qunit/qunit.css",
	"qunit/LICENSE.txt": "qunit/LICENSE.txt",

	"requirejs/require.js": "requirejs/require.js",

	"sinon/sinon.js": "sinon/pkg/sinon.js",
	"sinon/LICENSE.txt": "sinon/LICENSE"
};

async function npmcopy() {
	await fs.mkdir( path.resolve( projectDir, "external" ), {
		recursive: true
	} );
	for ( const [ dest, source ] of Object.entries( files ) ) {
		const from = path.resolve( projectDir, "node_modules", source );
		const to = path.resolve( projectDir, "external", dest );
		const toDir = path.dirname( to );
		await fs.mkdir( toDir, { recursive: true } );
		await fs.copyFile( from, to );
		console.log( `${ source } → ${ dest }` );
	}
}

npmcopy();
