"use strict";

const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );
const fs = require( "fs" );
const path = require( "path" );
const os = require( "os" );
const { argv } = require( "process" );
const version = argv[ 2 ];

if ( !version ) {
	throw new Error( "No version specified" );
}

// The cdn repo is cloned during release
const cdnFolder = "./.cdn/cdn";

// .min.js and .min.map files are expected
// in the same directory as the uncompressed files.
const sources = [
	"dist/jquery.js",
	"dist/jquery.slim.js"
];

// Map files need to reference the new uncompressed name;
// assume that all files reside in the same directory.
// "file":"jquery.min.js" ... "sources":["jquery.js"]
// This is only necessary for the versioned files.
async function makeVersionedMap( file, folder ) {
	const mapFile = file.replace( ".js", ".min.map" );
	const filename = path.basename( mapFile ).replace( "jquery", "jquery-" + version );
	let content = await fs.promises.readFile( mapFile, "utf8" );

	content = content
		.replace(
			/"file":"([^"]+)"/,
			"\"file\":\"" + filename.replace( /\.min\.map/, ".min.js\"" )
		)
		.replace(
			/"sources":\["([^"]+)"\]/,
			"\"sources\":[\"" + filename.replace( /\.min\.map/, ".js" ) + "\"]"
		);

	return fs.promises.writeFile(
		path.join( folder, filename ),
		content
	);
}

async function makeUnversionedCopies() {
	const folder = "cdn/unversioned";
	await fs.promises.mkdir( folder, { recursive: true } );

	return Promise.all(
		sources.map( async( file ) => {
			const filename = path.basename( file );
			const minFilename = filename.replace( ".js", ".min.js" );
			const mapFilename = filename.replace( ".js", ".min.map" );

			await exec( `cp -f ${file} ${folder}/${filename}` );
			await exec(
				`cp -f ${file.replace( ".js", ".min.js" )} ${folder}/${minFilename}`
			);
			await exec(
				`cp -f ${file.replace( ".js", ".min.map" )} ${folder}/${mapFilename}`
			);
		} )
	);
}

async function makeVersionedCopies() {
	const folder = "cdn/versioned";
	await fs.promises.mkdir( folder, { recursive: true } );

	return Promise.all(
		sources.map( async( file ) => {
			const filename = path
				.basename( file )
				.replace( "jquery", "jquery-" + version );
			const minFilename = filename.replace( ".js", ".min.js" );

			await exec( `cp -f ${file} ${folder}/${filename}` );
			await exec(
				`cp -f ${file.replace( ".js", ".min.js" )} ${folder}/${minFilename}`
			);
			await makeVersionedMap( file, folder );
		} )
	);
}

async function md5sum( files, folder ) {
	if ( os.platform() === "win32" ) {
		const rmd5 = /[a-f0-9]{32}/;
		const sum = [];

		for ( let i = 0; i < files.length; i++ ) {
			const { stdout } = await exec(
				"certutil -hashfile " + files[ i ] + " MD5",
				{ cwd: folder }
			);
			sum.push( rmd5.exec( stdout )[ 0 ] + " " + files[ i ] );
		}

		return sum.join( "\n" );
	}

	const { stdout } = exec( "md5 -r " + files.join( " " ), { cwd: folder } );
	return stdout;
}

function makeArchive( { cdn, folder } ) {
	return new Promise( async( resolve, reject ) => {
		console.log( `Creating production archive for ${cdn}...` );

		const archiver = require( "archiver" )( "zip" );
		const md5file = cdn + "-md5.txt";
		const output = fs.createWriteStream(
			path.join( folder, cdn + "-jquery-" + version + ".zip" )
		);

		output.on( "close", resolve );
		output.on( "error", reject );

		archiver.pipe( output );

		const files = await fs.promises.readdir( folder );
		const sum = await md5sum( files, folder );
		await fs.promises.writeFile( path.join( folder, md5file ), sum );
		files.push( md5file );

		files.forEach( ( file ) => {
			const stream = fs.createReadStream( path.join( folder, file ) );
			archiver.append( stream, {
				name: path.basename( file )
			} );
		} );

		archiver.finalize();
	} );
}

async function copyToRepo( folder ) {
	return exec( `cp -f ${folder}/* ${cdnFolder}` );
}


/**
 * Expects the cdn folder to not exist yet.
 * Remove it first.
 */
async function cdn() {
	await Promise.all( [ makeUnversionedCopies(), makeVersionedCopies() ] );

	await copyToRepo( "cdn/versioned" );

	await Promise.all( [
		makeArchive( { cdn: "googlecdn", folder: "cdn/unversioned" } ),
		makeArchive( { cdn: "mscdn", folder: "cdn/versioned" } )
	] );

	console.log( "Files ready for CDNs." );
}

cdn();
