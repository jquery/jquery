import fs from "node:fs/promises";
import { promisify } from "node:util";
import zlib from "node:zlib";
import { exec as nodeExec } from "node:child_process";
import chalk from "chalk";
import isCleanWorkingDir from "./isCleanWorkingDir.js";

const VERSION = 2;
const lastRunBranch = " last run";

const gzip = promisify( zlib.gzip );
const brotli = promisify( zlib.brotliCompress );
const exec = promisify( nodeExec );

async function getBranchName() {
	const { stdout } = await exec( "git rev-parse --abbrev-ref HEAD" );
	return stdout.trim();
}

async function getCommitHash() {
	const { stdout } = await exec( "git rev-parse HEAD" );
	return stdout.trim();
}

function getBranchHeader( branch, commit ) {
	let branchHeader = branch.trim();
	if ( commit ) {
		branchHeader = chalk.bold( branchHeader ) + chalk.gray( ` @${ commit }` );
	} else {
		branchHeader = chalk.italic( branchHeader );
	}
	return branchHeader;
}

async function getCache( loc ) {
	let cache;
	try {
		const contents = await fs.readFile( loc, "utf8" );
		cache = JSON.parse( contents );
	} catch ( err ) {
		return {};
	}

	const lastRun = cache[ lastRunBranch ];
	if ( !lastRun || !lastRun.meta || lastRun.meta.version !== VERSION ) {
		console.log( "Compare cache version mismatch. Rewriting..." );
		return {};
	}
	return cache;
}

function cacheResults( results ) {
	const files = Object.create( null );
	results.forEach( function( result ) {
		files[ result.filename ] = {
			raw: result.raw,
			gz: result.gz,
			br: result.br
		};
	} );
	return files;
}

function saveCache( loc, cache ) {

	// Keep cache readable for manual edits
	return fs.writeFile( loc, JSON.stringify( cache, null, "  " ) + "\n" );
}

function compareSizes( existing, current, padLength ) {
	if ( typeof current !== "number" ) {
		return chalk.grey( `${ existing }`.padStart( padLength ) );
	}
	const delta = current - existing;
	if ( delta > 0 ) {
		return chalk.red( `+${ delta }`.padStart( padLength ) );
	}
	return chalk.green( `${ delta }`.padStart( padLength ) );
}

function sortBranches( a, b ) {
	if ( a === lastRunBranch ) {
		return 1;
	}
	if ( b === lastRunBranch ) {
		return -1;
	}
	if ( a < b ) {
		return -1;
	}
	if ( a > b ) {
		return 1;
	}
	return 0;
}

export async function compareSize( { cache = ".sizecache.json", files } = {} ) {
	if ( !files || !files.length ) {
		throw new Error( "No files specified" );
	}

	const branch = await getBranchName();
	const commit = await getCommitHash();
	const sizeCache = await getCache( cache );

	let rawPadLength = 0;
	let gzPadLength = 0;
	let brPadLength = 0;
	const results = await Promise.all(
		files.map( async function( filename ) {

			let contents = await fs.readFile( filename, "utf8" );

			// Remove the short SHA and .dirty from comparisons.
			// The short SHA so commits can be compared against each other
			// and .dirty to compare with the existing branch during development.
			const sha = /jQuery v\d+.\d+.\d+(?:-[\w\.]+)?(?:\+slim\.|\+)?(\w+(?:\.dirty)?)?/.exec( contents )[ 1 ];
			contents = contents.replace( new RegExp( sha, "g" ), "" );

			const size = Buffer.byteLength( contents, "utf8" );
			const gzippedSize = ( await gzip( contents ) ).length;
			const brotlifiedSize = ( await brotli( contents ) ).length;

			// Add one to give space for the `+` or `-` in the comparison
			rawPadLength = Math.max( rawPadLength, size.toString().length + 1 );
			gzPadLength = Math.max( gzPadLength, gzippedSize.toString().length + 1 );
			brPadLength = Math.max( brPadLength, brotlifiedSize.toString().length + 1 );

			return { filename, raw: size, gz: gzippedSize, br: brotlifiedSize };
		} )
	);

	const sizeHeader = "raw".padStart( rawPadLength ) +
		"gz".padStart( gzPadLength + 1 ) +
		"br".padStart( brPadLength + 1 ) +
		" Filename";

	const sizes = results.map( function( result ) {
		const rawSize = result.raw.toString().padStart( rawPadLength );
		const gzSize = result.gz.toString().padStart( gzPadLength );
		const brSize = result.br.toString().padStart( brPadLength );
		return `${ rawSize } ${ gzSize } ${ brSize } ${ result.filename }`;
	} );

	const comparisons = Object.keys( sizeCache ).sort( sortBranches ).map( function( branch ) {
		const meta = sizeCache[ branch ].meta || {};
		const commit = meta.commit;

		const files = sizeCache[ branch ].files;
		const branchSizes = Object.keys( files ).map( function( filename ) {
			const branchResult = files[ filename ];
			const compareResult = results.find( function( result ) {
				return result.filename === filename;
			} ) || {};

			const compareRaw = compareSizes( branchResult.raw, compareResult.raw, rawPadLength );
			const compareGz = compareSizes( branchResult.gz, compareResult.gz, gzPadLength );
			const compareBr = compareSizes( branchResult.br, compareResult.br, brPadLength );
			return `${ compareRaw } ${ compareGz } ${ compareBr } ${ filename }`;
		} );

		return [
			"", // New line before each branch
			getBranchHeader( branch, commit ),
			sizeHeader,
			...branchSizes
		].join( "\n" );
	} );

	const output = [
		"", // Opening new line
		chalk.bold( "Sizes" ),
		sizeHeader,
		...sizes,
		...comparisons,
		"" // Closing new line
	].join( "\n" );

	console.log( output );

	// Always save the last run
	// Save version under last run
	sizeCache[ lastRunBranch ] = {
		meta: { version: VERSION },
		files: cacheResults( results )
	};

	// Only save cache for the current branch
	// if the working directory is clean.
	if ( await isCleanWorkingDir() ) {
		sizeCache[ branch ] = {
			meta: { commit },
			files: cacheResults( results )
		};
		console.log( `Saved cache for ${ branch }.` );
	}

	await saveCache( cache, sizeCache );

	return results;
}
