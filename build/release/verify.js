/**
 * Verify the latest release is reproducible
 */
import { exec as nodeExec } from "node:child_process";
import crypto from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import util from "node:util";
import { gunzip as nodeGunzip } from "node:zlib";
import { rimraf } from "rimraf";

const exec = util.promisify( nodeExec );
const gunzip = util.promisify( nodeGunzip );

const SRC_REPO = "https://github.com/jquery/jquery.git";
const CDN_URL = "https://code.jquery.com";
const REGISTRY_URL = "https://registry.npmjs.org/jquery";

const excludeFromCDN = [
	/^package\.json$/,
	/^jquery\.factory\./
];

const rjquery = /^jquery/;

async function verifyRelease( { version } = {} ) {
	if ( !version ) {
		version = process.env.VERSION || ( await getLatestVersion() );
	}
	const release = await buildRelease( { version } );

	console.log( `Verifying jQuery ${ version }...` );

	let verified = true;
	const matchingFiles = [];
	const mismatchingFiles = [];

	// Check all files against the CDN
	await Promise.all(
		release.files
			.filter( ( file ) => excludeFromCDN.every( ( re ) => !re.test( file.name ) ) )
			.map( async( file ) => {
				const url = new URL( file.cdnName, CDN_URL );
				const response = await fetch( url );
				if ( !response.ok ) {
					throw new Error(
						`Failed to download ${
							file.cdnName
						} from the CDN: ${ response.statusText }`
					);
				}
				const cdnContents = await response.text();
				if ( cdnContents !== file.cdnContents ) {
					mismatchingFiles.push( url.href );
					verified = false;
				} else {
					matchingFiles.push( url.href );
				}
			} )
	);

	// Check all files against npm.
	// First, download npm tarball for version
	const npmPackage = await fetch( REGISTRY_URL ).then( ( res ) => res.json() );

	if ( !npmPackage.versions[ version ] ) {
		throw new Error( `jQuery ${ version } not found on npm!` );
	}
	const npmTarball = npmPackage.versions[ version ].dist.tarball;

	// Write npm tarball to file
	const npmTarballPath = path.join( "tmp/verify", version, "npm.tgz" );
	await downloadFile( npmTarball, npmTarballPath );

	// Check the tarball checksum
	const tgzSum = await sumTarball( npmTarballPath );
	if ( tgzSum !== release.tgz.contents ) {
		mismatchingFiles.push( `npm:${ version }.tgz` );
		verified = false;
	} else {
		matchingFiles.push( `npm:${ version }.tgz` );
	}

	await Promise.all(
		release.files.map( async( file ) => {

			// Get file contents from tarball
			const { stdout: npmContents } = await exec(
				`tar -xOf ${ npmTarballPath } package/${ file.path }/${ file.name }`
			);

			if ( npmContents !== file.contents ) {
				mismatchingFiles.push( `npm:${ file.path }/${ file.name }` );
				verified = false;
			} else {
				matchingFiles.push( `npm:${ file.path }/${ file.name }` );
			}
		} )
	);

	if ( verified ) {
		console.log( `jQuery ${ version } is reproducible! All files match!` );
	} else {
		console.log();
		for ( const file of matchingFiles ) {
			console.log( `✅ ${ file }` );
		}
		console.log();
		for ( const file of mismatchingFiles ) {
			console.log( `❌ ${ file }` );
		}

		throw new Error( `jQuery ${ version } is NOT reproducible!` );
	}
}

async function buildRelease( { version } ) {
	const releaseFolder = path.join( "tmp/verify", version );

	// Clone the release repo
	console.log( `Cloning jQuery ${ version }...` );
	await rimraf( releaseFolder );
	await mkdir( releaseFolder, { recursive: true } );

	// Uses a depth of 2 so we can get the commit date of
	// the commit used to build, which is the commit before the tag
	await exec(
		`git clone -q -b ${ version } --depth=2 ${ SRC_REPO } ${ releaseFolder }`
	);

	// Install node dependencies
	console.log( `Installing dependencies for jQuery ${ version }...` );
	await exec( "npm ci", { cwd: releaseFolder } );

	// Find the date of the commit just before the release,
	// which was used as the date in the built files
	const { stdout: date } = await exec( "git log -1 --format=%ci HEAD~1", {
		cwd: releaseFolder
	} );

	// Build the release
	console.log( `Building jQuery ${ version }...` );
	const { stdout: buildOutput } = await exec( "npm run build:all", {
		cwd: releaseFolder,
		env: {

			// Keep existing environment variables
			...process.env,
			RELEASE_DATE: date,
			VERSION: version
		}
	} );
	console.log( buildOutput );

	// Pack the npm tarball
	console.log( `Packing jQuery ${ version }...` );
	const { stdout: packOutput } = await exec( "npm pack", { cwd: releaseFolder } );
	console.log( packOutput );

	// Get all top-level /dist and /dist-module files
	const distFiles = await readdir(
		path.join( releaseFolder, "dist" ),
		{ withFileTypes: true }
	);
	const distModuleFiles = await readdir(
		path.join( releaseFolder, "dist-module" ),
		{ withFileTypes: true }
	);

	const files = await Promise.all(
		[ ...distFiles, ...distModuleFiles ]
			.filter( ( dirent ) => dirent.isFile() )
			.map( async( dirent ) => {
				const contents = await readFile(
					path.join( dirent.parentPath, dirent.name ),
					"utf8"
				);
				return {
					name: dirent.name,
					path: path.basename( dirent.parentPath ),
					contents,
					cdnName: dirent.name.replace( rjquery, `jquery-${ version }` ),
					cdnContents: dirent.name.endsWith( ".map" ) ?

						// The CDN has versioned filenames in the maps
						convertMapToVersioned( contents, version ) :
						contents
				};
			} )
	);

	// Get checksum of the tarball
	const tgzFilename = `jquery-${ version }.tgz`;
	const sum = await sumTarball( path.join( releaseFolder, tgzFilename ) );

	return {
		files,
		tgz: {
			name: tgzFilename,
			contents: sum
		},
		version
	};
}

async function downloadFile( url, dest ) {
	const response = await fetch( url );
	const fileStream = createWriteStream( dest );
	const stream = Readable.fromWeb( response.body ).pipe( fileStream );
	return finished( stream );
}

async function getLatestVersion() {
	const { stdout: sha } = await exec( "git rev-list --tags --max-count=1" );
	const { stdout: tag } = await exec( `git describe --tags ${ sha.trim() }` );
	return tag.trim();
}

function shasum( data ) {
	const hash = crypto.createHash( "sha256" );
	hash.update( data );
	return hash.digest( "hex" );
}

async function sumTarball( filepath ) {
	const contents = await readFile( filepath );
	const unzipped = await gunzip( contents );
	return shasum( unzipped );
}

function convertMapToVersioned( contents, version ) {
	const map = JSON.parse( contents );
	return JSON.stringify( {
		...map,
		file: map.file.replace( rjquery, `jquery-${ version }` ),
		sources: map.sources.map( ( source ) => source.replace( rjquery, `jquery-${ version }` ) )
	} );
}

verifyRelease();
