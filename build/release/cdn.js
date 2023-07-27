import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { argv } from "node:process";
import util from "node:util";
import { exec as nodeExec } from "node:child_process";
import { rimraf } from "rimraf";
import archive from "./archive.js";

const exec = util.promisify( nodeExec );

const version = argv[ 2 ];

if ( !version ) {
	throw new Error( "No version specified" );
}

const archivesFolder = "tmp/archives";
const versionedFolder = `${ archivesFolder }/versioned`;
const unversionedFolder = `${ archivesFolder }/unversioned`;

// The cdn repo is cloned during release
const cdnRepoFolder = "tmp/release/cdn";

// .min.js and .min.map files are expected
// in the same directory as the uncompressed files.
const sources = [
	"dist/jquery.js",
	"dist/jquery.slim.js",
	"dist-module/jquery.module.js",
	"dist-module/jquery.slim.module.js"
];

const rminmap = /\.min\.map$/;
const rjs = /\.js$/;

function clean() {
	console.log( "Cleaning any existing archives..." );
	return rimraf( archivesFolder );
}

// Map files need to reference the new uncompressed name;
// assume that all files reside in the same directory.
// "file":"jquery.min.js" ... "sources":["jquery.js"]
// This is only necessary for the versioned files.
async function convertMapToVersioned( file, folder ) {
	const mapFile = file.replace( /\.js$/, ".min.map" );
	const filename = path
		.basename( mapFile )
		.replace( "jquery", "jquery-" + version );

	const contents = JSON.parse( await readFile( mapFile, "utf8" ) );

	return writeFile(
		path.join( folder, filename ),
		JSON.stringify( {
			...contents,
			file: filename.replace( rminmap, ".min.js" ),
			sources: [ filename.replace( rminmap, ".js" ) ]
		} )
	);
}

async function makeUnversionedCopies() {
	await mkdir( unversionedFolder, { recursive: true } );

	return Promise.all(
		sources.map( async( file ) => {
			const filename = path.basename( file );
			const minFilename = filename.replace( rjs, ".min.js" );
			const mapFilename = filename.replace( rjs, ".min.map" );

			await exec( `cp -f ${ file } ${ unversionedFolder }/${ filename }` );
			await exec(
				`cp -f ${ file.replace(
					rjs,
					".min.js"
				) } ${ unversionedFolder }/${ minFilename }`
			);
			await exec(
				`cp -f ${ file.replace(
					rjs,
					".min.map"
				) } ${ unversionedFolder }/${ mapFilename }`
			);
		} )
	);
}

async function makeVersionedCopies() {
	await mkdir( versionedFolder, { recursive: true } );

	return Promise.all(
		sources.map( async( file ) => {
			const filename = path
				.basename( file )
				.replace( "jquery", "jquery-" + version );
			const minFilename = filename.replace( rjs, ".min.js" );

			await exec( `cp -f ${ file } ${ versionedFolder }/${ filename }` );
			await exec(
				`cp -f ${ file.replace(
					rjs,
					".min.js"
				) } ${ versionedFolder }/${ minFilename }`
			);
			await convertMapToVersioned( file, versionedFolder );
		} )
	);
}

async function copyToRepo( folder ) {
	return exec( `cp -f ${ folder }/* ${ cdnRepoFolder }/cdn/` );
}

async function cdn() {
	await clean();

	await Promise.all( [ makeUnversionedCopies(), makeVersionedCopies() ] );

	await copyToRepo( versionedFolder );

	await Promise.all( [
		archive( { cdn: "googlecdn", folder: unversionedFolder, version } ),
		archive( { cdn: "mscdn", folder: versionedFolder, version } )
	] );

	console.log( "Files ready for CDNs." );
}

cdn();
