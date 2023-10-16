/**
 * Special build task to handle various jQuery build requirements.
 * Compiles JS modules into one bundle, sets the custom AMD name,
 * and includes/excludes specified modules
 */

"use strict";

const fs = require( "fs" );
const path = require( "path" );
const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );
const rollup = require( "rollup" );
const excludedFromSlim = require( "./lib/slim-exclude" );
const rollupFileOverrides = require( "./lib/rollup-plugin-file-overrides" );
const pkg = require( "../../package.json" );
const isCleanWorkingDir = require( "./lib/isCleanWorkingDir" );
const processForDist = require( "./dist" );
const minify = require( "./minify" );
const getTimestamp = require( "./lib/getTimestamp" );
const verifyNodeVersion = require( "./lib/verifyNodeVersion" );
const srcFolder = path.resolve( __dirname, "../../src" );

const minimum = [ "core" ];

// Exclude specified modules if the module matching the key is removed
const removeWith = {
	ajax: [ "manipulation/_evalUrl", "deprecated/ajax-event-alias" ],
	callbacks: [ "deferred" ],
	css: [ "effects", "dimensions", "offset" ],
	"css/showHide": [ "effects" ],
	deferred: {
		remove: [ "ajax", "effects", "queue", "core/ready" ],
		include: [ "core/ready-no-deferred" ]
	},
	event: [ "deprecated/ajax-event-alias", "deprecated/event" ],
	selector: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
};

async function read( filename ) {
	return fs.promises.readFile( path.join( srcFolder, filename ), "utf8" );
}

// Remove the src folder and file extension
// and ensure unix-style path separators
function moduleName( filename ) {
	return filename
		.replace( `${ srcFolder }${ path.sep }`, "" )
		.replace( /\.js$/, "" )
		.split( path.sep )
		.join( path.posix.sep );
}

async function readdirRecursive( dir, all = [] ) {
	let files;
	try {
		files = await fs.promises.readdir( path.join( srcFolder, dir ), {
			withFileTypes: true
		} );
	} catch ( e ) {
		return all;
	}
	for ( const file of files ) {
		const filepath = path.join( dir, file.name );

		if ( file.isDirectory() ) {
			all.push( ...( await readdirRecursive( filepath ) ) );
		} else {
			all.push( moduleName( filepath ) );
		}
	}
	return all;
}

async function getOutputRollupOptions( {
	esm = false,
	factory = false
} = {} ) {
	const wrapperFileName = `wrapper${
		factory ? "-factory" : ""
	}${
		esm ? "-esm" : ""
	}.js`;

	const wrapperSource = await read( wrapperFileName );

	// Catch `// @CODE` and subsequent comment lines event if they don't start
	// in the first column.
	const wrapper = wrapperSource.split(
		/[\x20\t]*\/\/ @CODE\n(?:[\x20\t]*\/\/[^\n]+\n)*/
	);

	return {

		// The ESM format is not actually used as we strip it during the
		// build, inserting our own wrappers; it's just that it doesn't
		// generate any extra wrappers so there's nothing for us to remove.
		format: "esm",

		intro: wrapper[ 0 ].replace( /\n*$/, "" ),
		outro: wrapper[ 1 ].replace( /^\n*/, "" )
	};
}

function unique( array ) {
	return [ ...new Set( array ) ];
}

async function checkExclude( exclude, include ) {
	const included = [ ...include ];
	const excluded = [ ...exclude ];

	for ( const module of exclude ) {
		if ( minimum.indexOf( module ) !== -1 ) {
			throw new Error( `Module \"${ module }\" is a minimum requirement.` );
		}

		// Exclude all files in the dir of the same name
		// These are the removable dependencies
		// It's fine if the directory is not there
		// `selector` is a special case as we don't just remove
		// the module, but we replace it with `selector-native`
		// which re-uses parts of the `src/selector` dir.
		if ( module !== "selector" ) {
			const files = await readdirRecursive( module );
			excluded.push( ...files );
		}

		// Check removeWith list
		const additional = removeWith[ module ];
		if ( additional ) {
			const [ additionalExcluded, additionalIncluded ] = await checkExclude(
				additional.remove || additional,
				additional.include || []
			);
			excluded.push( ...additionalExcluded );
			included.push( ...additionalIncluded );
		}
	}

	return [ unique( excluded ), unique( included ) ];
}

async function writeCompiled( { code, dir, filename, version } ) {
	const compiledContents = code

		// Embed Version
		.replace( /@VERSION/g, version )

		// Embed Date
		// yyyy-mm-ddThh:mmZ
		.replace( /@DATE/g, new Date().toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );

	await fs.promises.writeFile( path.join( dir, filename ), compiledContents );
	console.log( `[${ getTimestamp() }] ${ filename } v${ version } created.` );
}

// Build jQuery ECMAScript modules
async function build( {
	amd,
	dir = "dist",
	exclude = [],
	filename = "jquery.js",
	include = [],
	esm = false,
	factory = false,
	slim = false,
	version,
	watch = false
} = {} ) {
	const pureSlim = slim && !exclude.length && !include.length;

	const fileOverrides = new Map();

	function setOverride( filePath, source ) {

		// We want normalized paths in overrides as they will be matched
		// against normalized paths in the file overrides Rollup plugin.
		fileOverrides.set( path.resolve( filePath ), source );
	}

	// Add the short commit hash to the version string
	// when the version is not for a release.
	if ( !version ) {
		const { stdout } = await exec( "git rev-parse --short HEAD" );
		const isClean = await isCleanWorkingDir();

		// "+[slim.]SHA" is semantically correct
		// Add ".dirty" as well if the working dir is not clean
		version = `${ pkg.version }+${ slim ? "slim." : "" }${ stdout.trim() }${
			isClean ? "" : ".dirty"
		}`;
	} else if ( slim ) {
		version += "+slim";
	}

	await fs.promises.mkdir( dir, { recursive: true } );

	// Exclude slim modules when slim is true
	const [ excluded, included ] = await checkExclude(
		slim ? exclude.concat( excludedFromSlim ) : exclude,
		include
	);

	// Replace exports/global with a noop noConflict
	if ( excluded.includes( "exports/global" ) ) {
		const index = excluded.indexOf( "exports/global" );
		setOverride(
			`${ srcFolder }/exports/global.js`,
			"import { jQuery } from \"../core.js\";\n\n" +
				"jQuery.noConflict = function() {};"
		);
		excluded.splice( index, 1 );
	}

	// Set a desired AMD name.
	if ( amd != null ) {
		if ( amd ) {
			console.log( "Naming jQuery with AMD name: " + amd );
		} else {
			console.log( "AMD name now anonymous" );
		}

		// Replace the AMD name in the AMD export
		// No name means an anonymous define
		const amdExportContents = await read( "exports/amd.js" );
		setOverride(
			`${ srcFolder }/exports/amd.js`,
			amdExportContents.replace(

				// Remove the comma for anonymous defines
				/(\s*)"jquery"(,\s*)/,
				amd ? `$1\"${ amd }\"$2` : " "
			)
		);
	}

	// Append excluded modules to version.
	// Skip adding exclusions for slim builds.
	// Don't worry about semver syntax for these.
	if ( !pureSlim && excluded.length ) {
		version += " -" + excluded.join( ",-" );
	}

	// Append extra included modules to version.
	if ( !pureSlim && included.length ) {
		version += " +" + included.join( ",+" );
	}

	const inputOptions = {
		input: `${ srcFolder }/jquery.js`
	};

	const includedImports = included
		.map( ( module ) => `import "./${ module }.js";` )
		.join( "\n" );

	const jQueryFileContents = await read( "jquery.js" );
	if ( include.length ) {

		// If include is specified, only add those modules.
		setOverride( inputOptions.input, includedImports );
	} else {

		// Remove the jQuery export from the entry file, we'll use our own
		// custom wrapper.
		setOverride(
			inputOptions.input,
			jQueryFileContents.replace( /\n*export \{ jQuery, jQuery as \$ };\n*/, "\n" ) +
				includedImports
		);
	}

	// Replace excluded modules with empty sources.
	for ( const module of excluded ) {
		setOverride(
			`${ srcFolder }/${ module }.js`,

			// The `selector` module is not removed, but replaced
			// with `selector-native`.
			module === "selector" ? await read( "selector-native.js" ) : ""
		);
	}

	const outputOptions = await getOutputRollupOptions( { esm, factory } );

	if ( watch ) {
		const watcher = rollup.watch( {
			...inputOptions,
			output: [ outputOptions ],
			plugins: [ rollupFileOverrides( fileOverrides ) ],
			watch: {
				include: `${ srcFolder }/**`,
				skipWrite: true
			}
		} );

		watcher.on( "event", async( event ) => {
			switch ( event.code ) {
				case "ERROR":
					console.error( event.error );
					break;
				case "BUNDLE_END":
					const {
						output: [ { code } ]
					} = await event.result.generate( outputOptions );

					await writeCompiled( {
						code,
						dir,
						filename,
						version
					} );

					// Don't minify factory files; they are not meant
					// for the browser anyway.
					if ( !factory ) {
						await minify( { dir, filename, esm } );
					}
					break;
			}
		} );

		return watcher;
	} else {
		const bundle = await rollup.rollup( {
			...inputOptions,
			plugins: [ rollupFileOverrides( fileOverrides ) ]
		} );

		const {
			output: [ { code } ]
		} = await bundle.generate( outputOptions );

		await writeCompiled( { code, dir, filename, version } );

		// Don't minify factory files; they are not meant
		// for the browser anyway.
		if ( !factory ) {
			await minify( { dir, filename, esm } );
		} else {

			// We normally process for dist during minification to save
			// file reads. However, some files are not minified and then
			// we need to do it separately.
			const contents = await fs.promises.readFile(
				path.join( dir, filename ),
				"utf8"
			);
			processForDist( contents, filename );
		}
	}
}

async function buildDefaultFiles( { version, watch } = {} ) {
	await Promise.all( [
		build( { version, watch } ),
		build( { filename: "jquery.slim.js", slim: true, version, watch } ),
		build( {
			dir: "dist-module",
			filename: "jquery.module.js",
			esm: true,
			version,
			watch
		} ),
		build( {
			dir: "dist-module",
			filename: "jquery.slim.module.js",
			esm: true,
			slim: true,
			version,
			watch
		} ),

		build( {
			filename: "jquery.factory.js",
			factory: true,
			version,
			watch
		} ),
		build( {
			filename: "jquery.factory.slim.js",
			slim: true,
			factory: true,
			version,
			watch
		} ),
		build( {
			dir: "dist-module",
			filename: "jquery.factory.module.js",
			esm: true,
			factory: true,
			version,
			watch
		} ),
		build( {
			dir: "dist-module",
			filename: "jquery.factory.slim.module.js",
			esm: true,
			slim: true,
			factory: true,
			version,
			watch
		} )
	] );

	// Earlier Node.js versions do not support the ESM format.
	if ( !verifyNodeVersion() ) {
		return;
	}

	const { compareSize } = await import( "./compare_size.mjs" );
	return compareSize( {
		files: [
			"dist/jquery.min.js",
			"dist/jquery.slim.min.js",
			"dist-module/jquery.module.min.js",
			"dist-module/jquery.slim.module.min.js"
		]
	} );
}

module.exports = { build, buildDefaultFiles };
