import { rollup } from "rollup";

import { loadConfigFile } from "rollup/loadConfigFile";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );
const pureEsmConfigPath = path.resolve(
	dirname, "..", "rollup-pure-esm.config.js" );
const commonJSConfigPath = path.resolve(
	dirname, "..", "rollup-commonjs.config.js" );

// See https://rollupjs.org/javascript-api/#programmatically-loading-a-config-file
async function runRollup( name, configPath ) {

	console.log( `Running Rollup, version: ${ name }` );

	// options is an array of "inputOptions" objects with an additional
	// "output" property that contains an array of "outputOptions".
	// We generate a single output so the array only has one element.
	const {
		options: [ optionsObj ],
		warnings
	} = await loadConfigFile( configPath, {} );

	// "warnings" wraps the default `onwarn` handler passed by the CLI.
	// This prints all warnings up to this point:
	warnings.flush();

	const bundle = await rollup( optionsObj );
	await Promise.all( optionsObj.output.map( bundle.write ) );

	console.log( `Build completed: Rollup, version: ${ name }` );
}

export async function runRollupPureEsm() {
	await runRollup( "pure ESM", pureEsmConfigPath );
}

export async function runRollupEsmAndCommonJs() {
	await runRollup( "ESM + CommonJS", commonJSConfigPath );
}
