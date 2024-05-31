import fs from "node:fs/promises";
import jsdom, { JSDOM } from "jsdom";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runRollupEsmAndCommonJs, runRollupPureEsm } from "./lib/run-rollup.js";
import { runWebpack } from "./lib/run-webpack.js";
import { cleanTmpBundlersDir } from "./lib/utils.js";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );

async function runJSDOMTest( { title, folder } ) {
	console.log( "Running bundlers tests:", title );

	const template = await fs.readFile( `${ dirname }/test.html`, "utf-8" );
	const scriptSource = await fs.readFile(
		`${ dirname }/tmp/${ folder }/main.js`, "utf-8" );

	const html = template
		.replace( /@TITLE\b/, () => title )
		.replace( /@SCRIPT\b/, () => scriptSource );

	const virtualConsole = new jsdom.VirtualConsole();
	virtualConsole.sendTo( console );
	virtualConsole.on( "assert", ( success ) => {
		if ( !success ) {
			process.exitCode = 1;
		}
	} );

	new JSDOM( html, {
		resources: "usable",
		runScripts: "dangerously",
		virtualConsole
	} );

	if ( process.exitCode === 0 || process.exitCode == null ) {
		console.log( "Bundlers tests passed for:", title );
	} else {
		console.error( "Bundlers tests failed for:", title );
	}
}

async function buildAndTest() {
	await cleanTmpBundlersDir();

	await Promise.all( [
		runRollupPureEsm(),
		runRollupEsmAndCommonJs(),
		runWebpack()
	] );

	await Promise.all( [
		runJSDOMTest( {
			title: "Rollup with pure ESM setup",
			folder: "rollup-pure-esm"
		} ),

		runJSDOMTest( {
			title: "Rollup with ESM + CommonJS",
			folder: "rollup-commonjs"
		} ),

		runJSDOMTest( {
			title: "Webpack",
			folder: "webpack"
		} )
	] );

	// The directory won't be cleaned in case of failures; this may aid debugging.
	await cleanTmpBundlersDir();
}

await buildAndTest();
