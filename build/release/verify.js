/**
 * Verify the latest release is reproducible
 * Works with versions 4.0.0-beta.2 and later
 */
import chalk from "chalk";
import * as Diff from "diff";
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

const rstable = /^(\d+\.\d+\.\d+)$/;

export async function verifyRelease( { version } = {} ) {
	if ( !version ) {
		version = process.env.VERSION || ( await getLatestVersion() );
	}
	console.log( `Checking jQuery ${ version }...` );
	const release = await buildRelease( { version } );

	let verified = true;

	// Only check stable versions against the CDN
	if ( rstable.test( version ) ) {
		await Promise.all(
			release.files.map( async( file ) => {
				const cdnContents = await fetch( new URL( file.name, CDN_URL ) ).then(
					( res ) => res.text()
				);
				if ( cdnContents !== file.contents ) {
					console.log( `${ file.name } is different from the CDN:` );
					diffFiles( file.contents, cdnContents );
					verified = false;
				}
			} )
		);
	}

	// Check all releases against npm.
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
		console.log( `${ version }.tgz is different from npm:` );
		diffFiles( release.tgz.contents, tgzSum );
		verified = false;
	}

	await Promise.all(
		release.files.map( async( file ) => {

			// Get file contents from tarball
			const { stdout: npmContents } = await exec(
				`tar -xOf ${ npmTarballPath } package/${ file.path }/${ file.name }`
			);

			if ( npmContents !== file.contents ) {
				console.log( `${ file.name } is different from the CDN:` );
				diffFiles( file.contents, npmContents );
				verified = false;
			}
		} )
	);

	if ( verified ) {
		console.log( `jQuery ${ version } is reproducible!` );
	} else {
		throw new Error( `jQuery ${ version } is NOT reproducible!` );
	}
}

async function buildRelease( { version } ) {
	const releaseFolder = path.join( "tmp/verify", version );

	// Clone the release repo
	console.log( `Cloning jQuery ${ version }...` );
	await rimraf( releaseFolder );
	await mkdir( releaseFolder, { recursive: true } );
	await exec(
		`git clone -q -b ${ version } --depth=1 ${ SRC_REPO } ${ releaseFolder }`
	);

	// Install node dependencies
	console.log( `Installing dependencies for jQuery ${ version }...` );
	await exec( "npm ci", { cwd: releaseFolder } );

	// Build the release
	console.log( `Building jQuery ${ version }...` );
	const { stdout: buildOutput } = await exec( "npm run build:all", {
		cwd: releaseFolder,
		env: {
			VERSION: version
		}
	} );
	console.log( buildOutput );

	// Pack the npm tarball
	console.log( `Packing jQuery ${ version }...` );
	const { stdout: packOutput } = await exec( "npm pack", { cwd: releaseFolder } );
	console.log( packOutput );

	// Get all top-level /dist and /dist-module files
	const distFiles = await readdir( path.join( releaseFolder, "dist" ), {
		withFileTypes: true
	} );
	const distModuleFiles = await readdir(
		path.join( releaseFolder, "dist-module" ),
		{
			withFileTypes: true
		}
	);

	const files = await Promise.all(
		[ ...distFiles, ...distModuleFiles ]
			.filter( ( dirent ) => dirent.isFile() )
			.map( async( dirent ) => ( {
				name: dirent.name,
				path: path.basename( dirent.path ),
				contents: await readFile( path.join( dirent.path, dirent.name ), "utf8" )
			} ) )
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

async function diffFiles( a, b ) {
	const diff = Diff.diffLines( a, b );

	diff.forEach( ( part ) => {
		if ( part.added ) {
			console.log( chalk.green( part.value ) );
		} else if ( part.removed ) {
			console.log( chalk.red( part.value ) );
		} else {
			console.log( part.value );
		}
	} );
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
